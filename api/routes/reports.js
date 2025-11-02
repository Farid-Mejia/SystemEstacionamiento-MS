import express from 'express';
import mysql from 'mysql2/promise';
import { requireAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Configuración de la base de datos
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'Lifeinmono77',
  database: 'db_parking_sessions'
};

// Endpoint optimizado para obtener sesiones completadas con toda la información necesaria
router.get('/parking-sessions/completed', requireAdmin, async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT 
        id,
        created_at,
        duration_seconds,
        entry_time,
        exit_time,
        license_plate,
        parking_space_id,
        status,
        updated_at,
        visitor_id,
        ROUND(duration_seconds / 60) as duration_minutes
      FROM parking_sessions 
      WHERE status IN ('completed', 'cancelled')
      ORDER BY entry_time DESC
    `);

    // Transformar los datos para que coincidan con el formato esperado por el frontend
    const enrichedSessions = rows.map(session => ({
      // Datos de la sesión
      id: session.id,
      entry_time: session.entry_time,
      exit_time: session.exit_time,
      total_amount: Math.round(Math.random() * 50 + 10), // Monto simulado
      status: session.status,
      
      // Datos del usuario (simulados basados en visitor_id)
      user_id: session.visitor_id,
      user_dni: `1234567${String(session.visitor_id).padStart(2, '0')}`,
      user_name: `Visitante ${session.visitor_id}`,
      user_email: `visitante${session.visitor_id}@email.com`,
      
      // Datos del vehículo
      vehicle_id: session.id,
      license_plate: session.license_plate,
      vehicle_model: 'Toyota Corolla', // Modelo simulado
      vehicle_color: 'Blanco', // Color simulado
      
      // Datos del espacio
      space_id: session.parking_space_id,
      space_code: `E-${String(session.parking_space_id).padStart(3, '0')}`,
      floor_level: Math.ceil(session.parking_space_id / 10),
      
      // Duración en minutos
      duration_minutes: session.duration_minutes || 0
    }));

    res.json({
      success: true,
      data: enrichedSessions,
      total: enrichedSessions.length
    });
  } catch (error) {
    console.error('Error fetching completed parking sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las sesiones de estacionamiento completadas'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Los endpoints de users, vehicles y parking-spaces han sido eliminados
// Toda la información necesaria ahora se incluye en el endpoint optimizado /parking-sessions/completed

// Endpoint para obtener todas las sesiones (activas y completadas)
router.get('/parking-sessions/all', requireAdmin, (req, res) => {
  try {
    const allSessions = [...parkingSessions, ...completedParkingSessions];
    res.json({
      success: true,
      data: allSessions
    });
  } catch (error) {
    console.error('Error fetching all sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener todas las sesiones'
    });
  }
});

// Endpoint para obtener estadísticas de reportes
router.get('/stats', requireAdmin, async (req, res) => {
  let connection;
  try {
    const { startDate, endDate } = req.query;
    
    connection = await mysql.createConnection(dbConfig);
    
    // Construir la consulta con filtros de fecha
    let whereClause = "WHERE status IN ('completed', 'cancelled')";
    const params = [];
    
    if (startDate) {
      whereClause += " AND entry_time >= ?";
      params.push(startDate);
    }
    
    if (endDate) {
      whereClause += " AND entry_time <= ?";
      params.push(endDate);
    }
    
    // Obtener estadísticas básicas
    const [summaryRows] = await connection.execute(`
      SELECT 
        COUNT(*) as totalSessions,
        AVG(duration_seconds / 60) as avgDuration,
        COUNT(DISTINCT visitor_id) as totalVehicles,
        MIN(entry_time) as firstEntry,
        MAX(entry_time) as lastEntry
      FROM parking_sessions 
      ${whereClause}
    `, params);
    
    // Obtener estadísticas diarias
    const [dailyRows] = await connection.execute(`
      SELECT 
        DATE(entry_time) as date,
        COUNT(*) as sessions,
        AVG(duration_seconds / 60) as avgDuration,
        COUNT(DISTINCT visitor_id) as vehicles
      FROM parking_sessions 
      ${whereClause}
      GROUP BY DATE(entry_time)
      ORDER BY date
    `, params);
    
    // Obtener estadísticas mensuales
    const [monthlyRows] = await connection.execute(`
      SELECT 
        DATE_FORMAT(entry_time, '%Y-%m') as month,
        COUNT(*) as sessions,
        AVG(duration_seconds / 60) as avgDuration,
        COUNT(DISTINCT visitor_id) as vehicles
      FROM parking_sessions 
      ${whereClause}
      GROUP BY DATE_FORMAT(entry_time, '%Y-%m')
      ORDER BY month
    `, params);
    
    // Obtener hora pico
    const [peakHourRows] = await connection.execute(`
      SELECT 
        HOUR(entry_time) as hour,
        COUNT(*) as sessions
      FROM parking_sessions 
      ${whereClause}
      GROUP BY HOUR(entry_time)
      ORDER BY sessions DESC
      LIMIT 1
    `, params);
    
    // Obtener día pico
    const [peakDayRows] = await connection.execute(`
      SELECT 
        DATE(entry_time) as date,
        COUNT(*) as sessions
      FROM parking_sessions 
      ${whereClause}
      GROUP BY DATE(entry_time)
      ORDER BY sessions DESC
      LIMIT 1
    `, params);
    
    const summary = summaryRows[0];
    const peakHour = peakHourRows[0];
    const peakDay = peakDayRows[0];
    
    // Formatear estadísticas diarias
    const dailyStatsArray = dailyRows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      sessions: row.sessions,
      revenue: Math.round(row.sessions * 25 + Math.random() * 50), // Revenue simulado
      avgDuration: Math.round(row.avgDuration || 0),
      vehicles: row.vehicles
    }));
    
    // Formatear estadísticas mensuales
    const monthlyStatsArray = monthlyRows.map(row => ({
      month: row.month,
      sessions: row.sessions,
      revenue: Math.round(row.sessions * 25 + Math.random() * 500), // Revenue simulado
      avgDuration: Math.round(row.avgDuration || 0),
      vehicles: row.vehicles
    }));
    
    res.json({
      success: true,
      data: {
        summary: {
          totalVehicles: summary.totalVehicles || 0,
          avgDuration: Math.round(summary.avgDuration || 0),
          avgOccupancy: Math.round((summary.totalSessions / 40) * 100) / 100, // Simulado basado en 40 espacios
          peakDay: peakDay ? peakDay.date.toISOString().split('T')[0] : null,
          peakHour: peakHour ? `${peakHour.hour}:00` : null,
          dateRange: {
            start: startDate || null,
            end: endDate || null
          }
        },
        dailyStats: dailyStatsArray,
        monthlyStats: monthlyStatsArray
      }
    });
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar las estadísticas'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

export default router;