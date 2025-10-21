import express from 'express';
import { parkingSpaces, parkingSessions, users, vehicles } from '../data/mockData.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// GET /api/parking/spaces - Obtener todos los espacios de estacionamiento
router.get('/spaces', verifyToken, (req, res) => {
  try {
    // Separar espacios por piso
    const ssSpaces = parkingSpaces.filter(space => space.floor_level === 'SS');
    const s1Spaces = parkingSpaces.filter(space => space.floor_level === 'S1');

    // Contar espacios disponibles
    const availableCount = parkingSpaces.filter(space => space.is_available).length;
    const totalCount = parkingSpaces.length;

    res.json({
      success: true,
      message: 'Espacios de estacionamiento obtenidos',
      spaces: parkingSpaces,
      ss_spaces: ssSpaces,
      s1_spaces: s1Spaces,
      summary: {
        total: totalCount,
        available: availableCount,
        occupied: totalCount - availableCount
      }
    });

  } catch (error) {
    console.error('Error al obtener espacios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/parking/entry - Registrar ingreso de vehículo
router.post('/entry', verifyToken, (req, res) => {
  try {
    const { dni, license_plate, space_id } = req.body;

    // Validar datos requeridos
    if (!dni || !license_plate || !space_id) {
      return res.status(400).json({
        success: false,
        message: 'DNI, placa del vehículo y espacio son requeridos'
      });
    }

    // Verificar que el usuario existe
    const user = users.find(u => u.dni === dni);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado con el DNI proporcionado'
      });
    }

    // Verificar que el espacio existe y está disponible
    const space = parkingSpaces.find(s => s.id === parseInt(space_id));
    if (!space) {
      return res.status(404).json({
        success: false,
        message: 'Espacio de estacionamiento no encontrado'
      });
    }

    if (!space.is_available) {
      return res.status(400).json({
        success: false,
        message: 'El espacio seleccionado no está disponible'
      });
    }

    // Verificar si el vehículo ya está registrado para este usuario
    let vehicle = vehicles.find(v => v.license_plate === license_plate && v.user_id === user.id);
    
    // Si el vehículo no existe, crearlo
    if (!vehicle) {
      const newVehicleId = Math.max(...vehicles.map(v => v.id)) + 1;
      vehicle = {
        id: newVehicleId,
        user_id: user.id,
        license_plate: license_plate,
        model: 'No especificado',
        color: 'No especificado'
      };
      vehicles.push(vehicle);
    }

    // Verificar si el vehículo ya tiene una sesión activa
    const activeSession = parkingSessions.find(
      s => s.vehicle_id === vehicle.id && s.status === 'active'
    );

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'El vehículo ya tiene una sesión de estacionamiento activa'
      });
    }

    // Crear nueva sesión de estacionamiento
    const newSessionId = Math.max(...parkingSessions.map(s => s.id)) + 1;
    const newSession = {
      id: newSessionId,
      user_id: user.id,
      vehicle_id: vehicle.id,
      space_id: space.id,
      entry_time: new Date(),
      exit_time: null,
      total_amount: 0.00,
      status: 'active'
    };

    parkingSessions.push(newSession);

    // Marcar el espacio como ocupado
    space.is_available = false;

    res.json({
      success: true,
      message: 'Ingreso registrado exitosamente',
      session: {
        id: newSession.id,
        user: {
          dni: user.dni,
          name: user.name
        },
        vehicle: {
          license_plate: vehicle.license_plate,
          model: vehicle.model
        },
        space: {
          code: space.space_code,
          floor: space.floor_level
        },
        entry_time: newSession.entry_time
      }
    });

  } catch (error) {
    console.error('Error al registrar ingreso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/parking/exit - Registrar salida de vehículo
router.post('/exit', verifyToken, (req, res) => {
  try {
    const { dni, license_plate } = req.body;

    // Validar datos requeridos
    if (!dni || !license_plate) {
      return res.status(400).json({
        success: false,
        message: 'DNI y placa del vehículo son requeridos'
      });
    }

    // Verificar que el usuario existe
    const user = users.find(u => u.dni === dni);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado con el DNI proporcionado'
      });
    }

    // Buscar el vehículo
    const vehicle = vehicles.find(v => v.license_plate === license_plate && v.user_id === user.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado para este usuario'
      });
    }

    // Buscar sesión activa del vehículo
    const activeSession = parkingSessions.find(
      s => s.vehicle_id === vehicle.id && s.status === 'active'
    );

    if (!activeSession) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una sesión activa para este vehículo'
      });
    }

    // Obtener información del espacio
    const space = parkingSpaces.find(s => s.id === activeSession.space_id);

    // Calcular tiempo transcurrido y costo
    const exitTime = new Date();
    const entryTime = new Date(activeSession.entry_time);
    const timeElapsed = Math.ceil((exitTime - entryTime) / (1000 * 60 * 60)); // horas
    const hourlyRate = 5.00; // S/ 5.00 por hora
    const totalAmount = timeElapsed * hourlyRate;

    // Actualizar sesión
    activeSession.exit_time = exitTime;
    activeSession.total_amount = totalAmount;
    activeSession.status = 'completed';

    // Liberar el espacio
    if (space) {
      space.is_available = true;
    }

    res.json({
      success: true,
      message: 'Salida registrada exitosamente',
      session: {
        id: activeSession.id,
        user: {
          dni: user.dni,
          name: user.name
        },
        vehicle: {
          license_plate: vehicle.license_plate,
          model: vehicle.model
        },
        space: {
          code: space?.space_code,
          floor: space?.floor_level
        },
        entry_time: activeSession.entry_time,
        exit_time: exitTime,
        time_elapsed_hours: timeElapsed,
        total_amount: totalAmount
      }
    });

  } catch (error) {
    console.error('Error al registrar salida:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/parking/sessions - Obtener sesiones activas
router.get('/sessions', verifyToken, (req, res) => {
  try {
    const { status } = req.query;

    let sessions = parkingSessions;
    
    // Filtrar por estado si se proporciona
    if (status) {
      sessions = sessions.filter(s => s.status === status);
    }

    // Enriquecer sesiones con información adicional
    const enrichedSessions = sessions.map(session => {
      const user = users.find(u => u.id === session.user_id);
      const vehicle = vehicles.find(v => v.id === session.vehicle_id);
      const space = parkingSpaces.find(s => s.id === session.space_id);

      return {
        ...session,
        user: user ? { dni: user.dni, name: user.name } : null,
        vehicle: vehicle ? { license_plate: vehicle.license_plate, model: vehicle.model } : null,
        space: space ? { code: space.space_code, floor: space.floor_level } : null
      };
    });

    res.json({
      success: true,
      message: 'Sesiones obtenidas',
      sessions: enrichedSessions,
      total: enrichedSessions.length
    });

  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;