import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import dbConfig from './dbConfig.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Pool de conexiones
let pool;

// Función para obtener el pool de conexiones
async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(dbConfig);
      console.log('✅ Conectado a la base de datos SQL Server');
      return pool;
    } catch (err) {
      console.error('❌ Error al conectar a la base de datos:', err);
      throw err;
    }
  }
  return pool;
}

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para obtener todas las órdenes
app.get('/api/ordenes', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Ordenes');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener órdenes:', err);
    res.status(500).json({ error: 'Error al obtener órdenes', details: err.message });
  }
});

// Ruta para obtener una orden específica
app.get('/api/ordenes/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.SmallInt, parseInt(req.params.id))
      .query('SELECT * FROM Ordenes WHERE Orden = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener la orden:', err);
    res.status(500).json({ error: 'Error al obtener la orden', details: err.message });
  }
});

// Ruta para actualizar el estado y resultado de una orden
app.patch('/api/ordenes/:id', async (req, res) => {
  try {
    const { Estado, Resultado } = req.body;
    const pool = await getPool();
    
    let query = 'UPDATE Ordenes SET Estado = @estado';
    const request = pool.request()
      .input('id', sql.SmallInt, parseInt(req.params.id))
      .input('estado', sql.NVarChar(50), Estado);
    
    if (Resultado) {
      query += ', Resultado = @resultado';
      request.input('resultado', sql.NVarChar(50), Resultado);
    }
    
    query += ' WHERE Orden = @id';
    
    const result = await request.query(query);
    
    res.json({ message: 'Orden actualizada correctamente', affectedRows: result.rowsAffected[0] });
  } catch (err) {
    console.error('Error al actualizar la orden:', err);
    res.status(500).json({ error: 'Error al actualizar la orden', details: err.message });
  }
});

// Ruta para obtener métricas de operativos
app.get('/api/metrics/operatives', async (req, res) => {
  try {
    const pool = await getPool();
    
    // Consulta simplificada sin filtros complejos - similar a /api/ordenes
    // Obtener todos los trabajadores únicos y sus métricas totales
    const metricsQuery = `
      SELECT 
        Nombre,
        SUM(ProductQuantity) AS ProductQuantity,
        SUM(OrdersCompleted) AS OrdersCompleted
      FROM (
        SELECT 
          Sacador AS Nombre,
          SUM(Cantidad) AS ProductQuantity,
          COUNT(*) AS OrdersCompleted
        FROM Ordenes
        WHERE Sacador IS NOT NULL
        GROUP BY Sacador
        
        UNION ALL
        
        SELECT 
          Empacador AS Nombre,
          SUM(Cantidad) AS ProductQuantity,
          COUNT(*) AS OrdersCompleted
        FROM Ordenes
        WHERE Empacador IS NOT NULL
        GROUP BY Empacador
      ) AS CombinedMetrics
      GROUP BY Nombre
      ORDER BY Nombre
    `;
    
    const result = await pool.request().query(metricsQuery);
    
    // Mapear resultados
    const metrics = result.recordset.map(row => ({
      name: row.Nombre,
      productQuantity: row.ProductQuantity || 0,
      completed: row.OrdersCompleted || 0,
      efficiency: '0%',
      bonus: '0 USDC'
    }));
    
    res.json(metrics);
  } catch (err) {
    console.error('Error al obtener métricas:', err);
    res.status(500).json({ error: 'Error al obtener métricas', details: err.message });
  }
});

// Ruta para obtener órdenes de un trabajador específico con filtro de fechas
app.get('/api/operative/ordenes/:nombre', async (req, res) => {
  try {
    const pool = await getPool();
    const nombre = req.params.nombre;
    const { fechaInicio, fechaFin } = req.query;
    
    let query = `
      SELECT *
      FROM Ordenes
      WHERE (Sacador = @nombre OR Empacador = @nombre)
    `;
    
    const request = pool.request().input('nombre', sql.NVarChar(50), nombre);
    
    // Agregar filtro de fechas si se proporcionan
    if (fechaInicio && fechaFin) {
      query += ` AND CAST(FechaFinEmpaque AS DATE) BETWEEN @fechaInicio AND @fechaFin`;
      request.input('fechaInicio', sql.Date, fechaInicio);
      request.input('fechaFin', sql.Date, fechaFin);
    }
    
    query += ` ORDER BY FechaFinEmpaque DESC`;
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener órdenes del trabajador:', err);
    res.status(500).json({ error: 'Error al obtener órdenes', details: err.message });
  }
});

// Ruta para obtener datos de gráfico por trabajador y rango de fechas
app.get('/api/operative/chart/:nombre', async (req, res) => {
  try {
    const pool = await getPool();
    const nombre = req.params.nombre;
    const { fechaInicio, fechaFin } = req.query;
    
    let query = `
      SELECT 
        CAST(FechaFinEmpaque AS DATE) AS Fecha,
        SUM(Cantidad) AS Cantidad,
        COUNT(*) AS Ordenes
      FROM Ordenes
      WHERE (Sacador = @nombre OR Empacador = @nombre)
        AND FechaFinEmpaque IS NOT NULL
    `;
    
    const request = pool.request().input('nombre', sql.NVarChar(50), nombre);
    
    // Agregar filtro de fechas si se proporcionan
    if (fechaInicio && fechaFin) {
      query += ` AND CAST(FechaFinEmpaque AS DATE) BETWEEN @fechaInicio AND @fechaFin`;
      request.input('fechaInicio', sql.Date, fechaInicio);
      request.input('fechaFin', sql.Date, fechaFin);
    }
    
    query += ` GROUP BY CAST(FechaFinEmpaque AS DATE) ORDER BY CAST(FechaFinEmpaque AS DATE) ASC`;
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener datos del gráfico:', err);
    res.status(500).json({ error: 'Error al obtener datos del gráfico', details: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  // Conectar a la base de datos al iniciar
  try {
    await getPool();
  } catch (err) {
    console.error('No se pudo conectar a la base de datos al iniciar:', err);
  }
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  if (pool) {
    await pool.close();
    console.log('✅ Conexión a la base de datos cerrada');
  }
  process.exit(0);
});