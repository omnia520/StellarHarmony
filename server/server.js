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
    
    // Agregar filtro de fechas si se proporcionan (comparando strings ya que FechaFinEmpaque es nvarchar)
    if (fechaInicio && fechaFin) {
      query += ` AND FechaFinEmpaque BETWEEN @fechaInicio AND @fechaFin`;
      request.input('fechaInicio', sql.NVarChar(50), fechaInicio);
      request.input('fechaFin', sql.NVarChar(50), fechaFin);
    }
    
    // NO usar ORDER BY aquí - puede causar conversión implícita a fecha que falla con muchos registros
    // Ordenaremos en el frontend si es necesario
    
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
    
    console.log(`📊 Consultando gráfico para: ${nombre}, fechas: ${fechaInicio} - ${fechaFin}`);
    
    // Como FechaFinEmpaque es nvarchar, obtenemos todos los registros primero
    // y luego los procesamos en JavaScript para agrupar por fecha
    let query = `
      SELECT 
        FechaFinEmpaque,
        Cantidad
      FROM Ordenes
      WHERE (Sacador = @nombre OR Empacador = @nombre)
        AND FechaFinEmpaque IS NOT NULL
        AND FechaFinEmpaque != ''
        AND FechaFinEmpaque != 'NULL'
    `;
    
    const request = pool.request().input('nombre', sql.NVarChar(50), nombre);
    
    // Agregar filtro de fechas si se proporcionan (comparando strings directamente)
    // NO usar funciones SQL como LEFT() o ORDER BY porque SQL Server intenta convertir a fecha implícitamente
    if (fechaInicio && fechaFin) {
      // Formatear fechas para comparación string (YYYY-MM-DD)
      const fechaInicioStr = typeof fechaInicio === 'string' ? fechaInicio : fechaInicio;
      const fechaFinStr = typeof fechaFin === 'string' ? fechaFin : fechaFin;
      // Comparar strings directamente sin usar funciones SQL
      query += ` AND FechaFinEmpaque >= @fechaInicio AND FechaFinEmpaque <= @fechaFin`;
      request.input('fechaInicio', sql.NVarChar(50), fechaInicioStr.substring(0, 10));
      request.input('fechaFin', sql.NVarChar(50), fechaFinStr.substring(0, 10) + ' 23:59:59');
    }
    
    // NO usar ORDER BY aquí - causa conversión implícita a fecha que falla con muchos registros
    // Ordenaremos en JavaScript después del procesamiento (línea 265)
    
    const result = await request.query(query);
    
    console.log(`✅ Datos del gráfico obtenidos: ${result.recordset.length} registros`);
    
    // Agrupar por fecha en JavaScript (más seguro que en SQL)
    const groupedByDate = {};
    
    result.recordset.forEach(row => {
      const fechaStr = row.FechaFinEmpaque;
      if (!fechaStr || fechaStr === 'NULL' || fechaStr.trim() === '') return;
      
      // Extraer solo la parte de fecha (primeros 10 caracteres: YYYY-MM-DD)
      let fechaKey = fechaStr.trim().substring(0, 10);
      
      // Si no tiene formato YYYY-MM-DD, intentar parsear
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaKey)) {
        try {
          const fechaParsed = new Date(fechaStr);
          if (!isNaN(fechaParsed.getTime())) {
            fechaKey = fechaParsed.toISOString().split('T')[0];
          } else {
            // Intentar formato DD/MM/YYYY o MM/DD/YYYY
            const parts = fechaStr.split(/[/-]/);
            if (parts.length === 3) {
              // Asumir formato YYYY-MM-DD o intentar MM/DD/YYYY
              if (parts[0].length === 4) {
                fechaKey = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
              } else {
                fechaKey = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              }
            }
          }
        } catch (e) {
          console.warn('Error parseando fecha:', fechaStr, e);
          return; // Saltar este registro
        }
      }
      
      if (!groupedByDate[fechaKey]) {
        groupedByDate[fechaKey] = { cantidad: 0, ordenes: 0 };
      }
      
      groupedByDate[fechaKey].cantidad += Number(row.Cantidad) || 0;
      groupedByDate[fechaKey].ordenes += 1;
    });
    
    // Convertir a array y formatear
    const formatted = Object.keys(groupedByDate)
      .sort() // Ordenar por fecha
      .map(fechaKey => {
        const data = groupedByDate[fechaKey];
        return {
          Fecha: fechaKey,
          Cantidad: data.cantidad,
          Ordenes: data.ordenes,
          FechaParsed: fechaKey
        };
      });
    
    console.log(`✅ Datos agrupados: ${formatted.length} fechas únicas`);
    res.json(formatted);
  } catch (err) {
    console.error('❌ Error al obtener datos del gráfico:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Error al obtener datos del gráfico', details: err.message });
  }
});

// Ruta para autenticar por wallet y obtener rol
app.get('/api/auth/wallet/:wallet', async (req, res) => {
  try {
    const pool = await getPool();
    const wallet = req.params.wallet;
    
    console.log(`🔐 Autenticando wallet: ${wallet}`);
    
    const query = `
      SELECT Nombre, Rol, Wallet
      FROM Usuario
      WHERE Wallet = @wallet
    `;
    
    const result = await pool.request()
      .input('wallet', sql.NVarChar(100), wallet)
      .query(query);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Wallet no encontrada en la base de datos' });
    }
    
    const user = result.recordset[0];
    res.json({
      nombre: user.Nombre,
      rol: user.Rol.toLowerCase(), // "lider" o "trabajador"
      wallet: user.Wallet
    });
  } catch (err) {
    console.error('❌ Error al autenticar wallet:', err);
    res.status(500).json({ error: 'Error al autenticar wallet', details: err.message });
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