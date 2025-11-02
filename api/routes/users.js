import express from 'express';
import { users, vehicles } from '../data/mockData.js';
import { verifyToken } from './auth.js';
import { requireAdmin, requireAdminOrOperator } from '../middleware/roleAuth.js';

const router = express.Router();

// GET /api/users/dni/:dni - Consultar usuario por DNI
router.get('/dni/:dni', verifyToken, (req, res) => {
  try {
    const { dni } = req.params;

    // Validar formato de DNI (8 dígitos)
    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
      return res.status(400).json({
        success: false,
        message: 'DNI debe tener 8 dígitos numéricos'
      });
    }

    // Buscar usuario por DNI
    const user = users.find(u => u.dni === dni);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado con el DNI proporcionado'
      });
    }

    // Buscar vehículos del usuario
    const userVehicles = vehicles.filter(v => v.user_id === user.id);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Usuario encontrado',
      user: {
        id: user.id,
        dni: user.dni,
        name: user.name,
        email: user.email,
        vehicles: userVehicles
      }
    });

  } catch (error) {
    console.error('Error al consultar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/users - Obtener todos los usuarios (solo para admin)
router.get('/', requireAdmin, (req, res) => {
  try {

    // Obtener todos los usuarios con sus vehículos
    const usersWithVehicles = users.map(user => {
      const userVehicles = vehicles.filter(v => v.user_id === user.id);
      return {
        ...user,
        vehicles: userVehicles
      };
    });

    res.json({
      success: true,
      message: 'Lista de usuarios obtenida',
      users: usersWithVehicles,
      total: usersWithVehicles.length
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }

    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const userVehicles = vehicles.filter(v => v.user_id === user.id);

    res.json({
      success: true,
      message: 'Usuario encontrado',
      user: {
        ...user,
        vehicles: userVehicles
      }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;