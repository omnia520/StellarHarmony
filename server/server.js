import express from 'express';
import cors from 'cors';
// import sql from 'mssql';
// import dbConfig from './dbConfig.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// DATOS HARDCODEADOS - IGNORAR BASE DE DATOS
// ============================================

// Usuarios: 1 líder + 10 trabajadores
const usuarios = [
  { Nombre: 'Carlos', Rol: 'lider', Wallet: 'GBI2K3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0' },
  { Nombre: 'Johan', Rol: 'trabajador', Wallet: 'GBI2K3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0HSZY' },
  { Nombre: 'Andres', Rol: 'trabajador', Wallet: 'GDBK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0ABCD' },
  { Nombre: 'Angel', Rol: 'trabajador', Wallet: 'GECK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0EFGH' },
  { Nombre: 'Emilio', Rol: 'trabajador', Wallet: 'GDFK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0IJKL' },
  { Nombre: 'Sergio', Rol: 'trabajador', Wallet: 'GDGK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0MNOP' },
  { Nombre: 'Darlinson', Rol: 'trabajador', Wallet: 'GDHK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0QRST' },
  { Nombre: 'Gustavo', Rol: 'trabajador', Wallet: 'GDIK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0UVWX' },
  { Nombre: 'Maria', Rol: 'trabajador', Wallet: 'GDJK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0YZAB' },
  { Nombre: 'Pedro', Rol: 'trabajador', Wallet: 'GDKK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0CDEF' },
  { Nombre: 'Ana', Rol: 'trabajador', Wallet: 'GDLK3J5M6N7P8Q9R0S1T2U3V4W5X6Y7Z8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0GHIJ' },
];

// Generar órdenes hardcodeadas para cada trabajador
function generarOrdenes() {
  const ordenes = [];
  const trabajadores = usuarios.filter(u => u.Rol === 'trabajador');
  const estados = ['Terminado', 'Terminado', 'Terminado', 'Empacando', 'Pending'];
  const resultados = ['Correct', 'Correct', 'Correct', 'Issues', null];
  
  let ordenId = 3000;
  const hoy = new Date();
  
  trabajadores.forEach((trabajador, idx) => {
    // Cada trabajador tiene entre 15-25 órdenes
    const numOrdenes = 15 + Math.floor(Math.random() * 11);
    
    for (let i = 0; i < numOrdenes; i++) {
      const diasAtras = Math.floor(Math.random() * 30); // Últimos 30 días
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - diasAtras);
      
      const cantidad = 50 + Math.floor(Math.random() * 500); // 50-550 items
      const estado = estados[Math.floor(Math.random() * estados.length)];
      const resultado = estado === 'Terminado' ? resultados[Math.floor(Math.random() * resultados.length)] : null;
      
      // Tiempos aleatorios
      const horaInicio = 8 + Math.floor(Math.random() * 4); // 8-11 AM
      const minInicio = Math.floor(Math.random() * 60);
      const duracionMin = 30 + Math.floor(Math.random() * 120); // 30-150 minutos
      
      const fechaInicioSacado = new Date(fecha);
      fechaInicioSacado.setHours(horaInicio, minInicio, 0);
      
      const fechaFinSacado = new Date(fechaInicioSacado);
      fechaFinSacado.setMinutes(fechaFinSacado.getMinutes() + duracionMin / 2);
      
      const fechaInicioEmpaque = new Date(fechaFinSacado);
      fechaInicioEmpaque.setMinutes(fechaInicioEmpaque.getMinutes() + 5);
      
      const fechaFinEmpaque = new Date(fechaInicioEmpaque);
      fechaFinEmpaque.setMinutes(fechaFinEmpaque.getMinutes() + duracionMin / 2);
      
      // Decidir si es picker, packer o ambos
      const otroTrabajador = trabajadores[Math.floor(Math.random() * trabajadores.length)];
      const esPicker = Math.random() > 0.3; // 70% chance de ser picker
      const esPacker = Math.random() > 0.3; // 70% chance de ser packer
      
      ordenes.push({
        Orden: ordenId++,
        Cantidad: cantidad,
        Sacador: esPicker ? trabajador.Nombre : otroTrabajador.Nombre,
        Empacador: esPacker ? trabajador.Nombre : otroTrabajador.Nombre,
        Estado: estado,
        FechaInicioSacado: fechaInicioSacado.toISOString(),
        FechaFinSacado: fechaFinSacado.toISOString(),
        FechaInicioEmpaque: fechaInicioEmpaque.toISOString(),
        FechaFinEmpaque: fechaFinEmpaque.toISOString(),
        Resultado: resultado
      });
    }
  });
  
  return ordenes;
}

const ordenesHardcodeadas = generarOrdenes();

// Función para calcular eficiencia (basada en cantidad procesada vs meta de 3000/día)
function calcularEficiencia(cantidadTotal, diasTrabajados) {
  if (diasTrabajados === 0) return 0;
  const promedioDiario = cantidadTotal / diasTrabajados;
  const eficiencia = (promedioDiario / 3000) * 100;
  return Math.min(100, Math.max(0, Math.round(eficiencia * 10) / 10)); // Máximo 100%, mínimo 0%
}

// Función para calcular bonos (basado en eficiencia y órdenes completadas)
function calcularBono(eficiencia, ordenesCompletadas) {
  let bono = 0;
  // Base: $10 USDC por orden completada
  bono += ordenesCompletadas * 10;
  // Bonus por eficiencia: si > 90%, +$5 por orden; si > 95%, +$10 por orden
  if (eficiencia >= 95) {
    bono += ordenesCompletadas * 10;
  } else if (eficiencia >= 90) {
    bono += ordenesCompletadas * 5;
  }
  return Math.round(bono);
}

// Pool de conexiones - COMENTADO
// let pool;
// async function getPool() {
//   if (!pool) {
//     try {
//       pool = await sql.connect(dbConfig);
//       console.log('✅ Conectado a la base de datos SQL Server');
//       return pool;
//     } catch (err) {
//       console.error('❌ Error al conectar a la base de datos:', err);
//       throw err;
//     }
//   }
//   return pool;
// }

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para obtener todas las órdenes
app.get('/api/ordenes', async (req, res) => {
  try {
    res.json(ordenesHardcodeadas);
  } catch (err) {
    console.error('Error al obtener órdenes:', err);
    res.status(500).json({ error: 'Error al obtener órdenes', details: err.message });
  }
});

// Ruta para obtener una orden específica
app.get('/api/ordenes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const orden = ordenesHardcodeadas.find(o => o.Orden === id);
    
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(orden);
  } catch (err) {
    console.error('Error al obtener la orden:', err);
    res.status(500).json({ error: 'Error al obtener la orden', details: err.message });
  }
});

// Ruta para actualizar el estado y resultado de una orden
app.patch('/api/ordenes/:id', async (req, res) => {
  try {
    const { Estado, Resultado } = req.body;
    const id = parseInt(req.params.id);
    const ordenIndex = ordenesHardcodeadas.findIndex(o => o.Orden === id);
    
    if (ordenIndex === -1) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    ordenesHardcodeadas[ordenIndex].Estado = Estado;
    if (Resultado) {
      ordenesHardcodeadas[ordenIndex].Resultado = Resultado;
    }
    
    res.json({ message: 'Orden actualizada correctamente', affectedRows: 1 });
  } catch (err) {
    console.error('Error al actualizar la orden:', err);
    res.status(500).json({ error: 'Error al actualizar la orden', details: err.message });
  }
});

// Ruta para obtener métricas de operativos
app.get('/api/metrics/operatives', async (req, res) => {
  try {
    const trabajadores = usuarios.filter(u => u.Rol === 'trabajador');
    const metrics = [];
    
    trabajadores.forEach(trabajador => {
      // Filtrar órdenes donde el trabajador participó
      const ordenesTrabajador = ordenesHardcodeadas.filter(
        o => o.Sacador === trabajador.Nombre || o.Empacador === trabajador.Nombre
      );
      
      // Calcular cantidad total de productos
      let productQuantity = 0;
      ordenesTrabajador.forEach(o => {
        if (o.Sacador === trabajador.Nombre) productQuantity += o.Cantidad;
        if (o.Empacador === trabajador.Nombre) productQuantity += o.Cantidad;
      });
      
      // Contar órdenes completadas (Terminado)
      const ordenesCompletadas = ordenesTrabajador.filter(
        o => o.Estado === 'Terminado' || o.Estado === 'terminado'
      ).length;
      
      // Calcular días trabajados (fechas únicas)
      const fechasUnicas = new Set();
      ordenesTrabajador.forEach(o => {
        if (o.FechaFinEmpaque) {
          const fecha = new Date(o.FechaFinEmpaque).toISOString().split('T')[0];
          fechasUnicas.add(fecha);
        }
      });
      const diasTrabajados = fechasUnicas.size || 1;
      
      // Calcular eficiencia
      const eficiencia = calcularEficiencia(productQuantity, diasTrabajados);
      
      // Calcular bono
      const bono = calcularBono(eficiencia, ordenesCompletadas);
      
      metrics.push({
        name: trabajador.Nombre,
        productQuantity: productQuantity,
        completed: ordenesCompletadas,
        efficiency: `${eficiencia}%`,
        bonus: `${bono} USDC`
      });
    });
    
    // Ordenar por nombre
    metrics.sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(metrics);
  } catch (err) {
    console.error('Error al obtener métricas:', err);
    res.status(500).json({ error: 'Error al obtener métricas', details: err.message });
  }
});

// Ruta para obtener órdenes de un trabajador específico con filtro de fechas
app.get('/api/operative/ordenes/:nombre', async (req, res) => {
  try {
    const nombre = decodeURIComponent(req.params.nombre);
    const { fechaInicio, fechaFin } = req.query;
    
    // Filtrar órdenes del trabajador
    let ordenes = ordenesHardcodeadas.filter(
      o => o.Sacador === nombre || o.Empacador === nombre
    );
    
    // Aplicar filtro de fechas si se proporcionan
    if (fechaInicio && fechaFin) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      fechaFinDate.setHours(23, 59, 59, 999);
      
      ordenes = ordenes.filter(o => {
        if (!o.FechaFinEmpaque) return false;
        const fechaOrden = new Date(o.FechaFinEmpaque);
        return fechaOrden >= fechaInicioDate && fechaOrden <= fechaFinDate;
      });
    }
    
    // Ordenar por fecha descendente (más recientes primero)
    ordenes.sort((a, b) => {
      const fechaA = new Date(a.FechaFinEmpaque || 0);
      const fechaB = new Date(b.FechaFinEmpaque || 0);
      return fechaB - fechaA;
    });
    
    res.json(ordenes);
  } catch (err) {
    console.error('Error al obtener órdenes del trabajador:', err);
    res.status(500).json({ error: 'Error al obtener órdenes', details: err.message });
  }
});

// Ruta para obtener datos de gráfico por trabajador y rango de fechas
app.get('/api/operative/chart/:nombre', async (req, res) => {
  try {
    const nombre = decodeURIComponent(req.params.nombre);
    const { fechaInicio, fechaFin } = req.query;
    
    console.log(`📊 Consultando gráfico para: ${nombre}, fechas: ${fechaInicio} - ${fechaFin}`);
    
    // Filtrar órdenes del trabajador
    let ordenes = ordenesHardcodeadas.filter(
      o => (o.Sacador === nombre || o.Empacador === nombre) && o.FechaFinEmpaque
    );
    
    // Aplicar filtro de fechas si se proporcionan
    if (fechaInicio && fechaFin) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);
      fechaFinDate.setHours(23, 59, 59, 999);
      
      ordenes = ordenes.filter(o => {
        const fechaOrden = new Date(o.FechaFinEmpaque);
        return fechaOrden >= fechaInicioDate && fechaOrden <= fechaFinDate;
      });
    }
    
    // Agrupar por fecha
    const groupedByDate = {};
    
    ordenes.forEach(orden => {
      const fecha = new Date(orden.FechaFinEmpaque);
      const fechaKey = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!groupedByDate[fechaKey]) {
        groupedByDate[fechaKey] = { cantidad: 0, ordenes: 0 };
      }
      
      // Sumar cantidad si el trabajador participó
      if (orden.Sacador === nombre) {
        groupedByDate[fechaKey].cantidad += orden.Cantidad;
      }
      if (orden.Empacador === nombre) {
        groupedByDate[fechaKey].cantidad += orden.Cantidad;
      }
      groupedByDate[fechaKey].ordenes += 1;
    });
    
    // Convertir a array y formatear
    const formatted = Object.keys(groupedByDate)
      .sort() // Ordenar por fecha
      .map(fechaKey => ({
        Fecha: fechaKey,
        Cantidad: groupedByDate[fechaKey].cantidad,
        Ordenes: groupedByDate[fechaKey].ordenes,
        FechaParsed: fechaKey
      }));
    
    console.log(`✅ Datos agrupados: ${formatted.length} fechas únicas`);
    res.json(formatted);
  } catch (err) {
    console.error('❌ Error al obtener datos del gráfico:', err);
    res.status(500).json({ error: 'Error al obtener datos del gráfico', details: err.message });
  }
});

// Ruta para autenticar por wallet y obtener rol
app.get('/api/auth/wallet/:wallet', async (req, res) => {
  try {
    const wallet = decodeURIComponent(req.params.wallet);
    
    console.log(`🔐 Autenticando wallet: ${wallet}`);
    
    const usuario = usuarios.find(u => u.Wallet === wallet);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Wallet no encontrada en la base de datos' });
    }
    
    res.json({
      nombre: usuario.Nombre,
      rol: usuario.Rol.toLowerCase(), // "lider" o "trabajador"
      wallet: usuario.Wallet
    });
  } catch (err) {
    console.error('❌ Error al autenticar wallet:', err);
    res.status(500).json({ error: 'Error al autenticar wallet', details: err.message });
  }
});

// Ruta para obtener métricas de un trabajador específico
app.get('/api/operative/metrics/:nombre', async (req, res) => {
  try {
    const nombre = decodeURIComponent(req.params.nombre);
    
    // Filtrar órdenes del trabajador
    const ordenesTrabajador = ordenesHardcodeadas.filter(
      o => o.Sacador === nombre || o.Empacador === nombre
    );
    
    // Calcular cantidad total de productos
    let productQuantity = 0;
    ordenesTrabajador.forEach(o => {
      if (o.Sacador === nombre) productQuantity += o.Cantidad;
      if (o.Empacador === nombre) productQuantity += o.Cantidad;
    });
    
    // Contar órdenes completadas
    const ordenesCompletadas = ordenesTrabajador.filter(
      o => o.Estado === 'Terminado' || o.Estado === 'terminado'
    ).length;
    
    // Calcular días trabajados
    const fechasUnicas = new Set();
    ordenesTrabajador.forEach(o => {
      if (o.FechaFinEmpaque) {
        const fecha = new Date(o.FechaFinEmpaque).toISOString().split('T')[0];
        fechasUnicas.add(fecha);
      }
    });
    const diasTrabajados = fechasUnicas.size || 1;
    
    // Calcular eficiencia
    const eficiencia = calcularEficiencia(productQuantity, diasTrabajados);
    
    // Calcular bono
    const bono = calcularBono(eficiencia, ordenesCompletadas);
    
    res.json({
      productQuantity: productQuantity,
      completed: ordenesCompletadas,
      efficiency: `${eficiencia}%`,
      bonus: `${bono} USDC`
    });
  } catch (err) {
    console.error('Error al obtener métricas del trabajador:', err);
    res.status(500).json({ error: 'Error al obtener métricas', details: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Datos hardcodeados: ${ordenesHardcodeadas.length} órdenes, ${usuarios.length} usuarios`);
  console.log(`👥 Trabajadores: ${usuarios.filter(u => u.Rol === 'trabajador').length}, Líderes: ${usuarios.filter(u => u.Rol === 'lider').length}`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  process.exit(0);
});