import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { operators, refreshTokens } from '../data/mockData.js';

const router = express.Router();
const JWT_SECRET = 'parksystem_secret_key_2024'; // En producción usar variable de entorno

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password, remember } = req.body;

    // Validar datos requeridos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar operador por username
    const operator = operators.find(op => op.username === username);
    
    if (!operator) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, operator.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar access token (15 minutos)
    const accessToken = jwt.sign(
      { 
        id: operator.id, 
        username: operator.username, 
        role: operator.role,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generar refresh token (7 días)
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenData = {
      token: refreshToken,
      userId: operator.id,
      username: operator.username,
      role: operator.role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      createdAt: new Date()
    };

    // Almacenar refresh token en memoria
    refreshTokens.push(refreshTokenData);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900, // 15 minutos en segundos
      token_type: 'Bearer',
      user: {
        id: operator.id,
        username: operator.username,
        name: operator.name,
        role: operator.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Middleware para verificar token JWT
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// GET /api/auth/verify - Verificar si el token es válido
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: req.user
  });
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', verifyToken, (req, res) => {
  try {
    // En una implementación real, aquí se invalidaría el token
    // Por ejemplo, agregándolo a una lista negra en base de datos
    // Para esta implementación simple, solo devolvemos un mensaje de éxito
    
    res.json({
      success: true,
      message: 'Logout exitoso',
      user: {
        username: req.user.username,
        name: req.user.name || req.user.username
      }
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/refresh - Renovar access token usando refresh token
router.post('/refresh', (req, res) => {
  try {
    const { refresh_token } = req.body;

    // Validar que se proporcione el refresh token
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token es requerido'
      });
    }

    // Buscar el refresh token en el almacenamiento
    const tokenData = refreshTokens.find(rt => rt.token === refresh_token);

    if (!tokenData) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Verificar si el refresh token ha expirado
    if (new Date() > tokenData.expiresAt) {
      // Remover token expirado del almacenamiento
      const index = refreshTokens.findIndex(rt => rt.token === refresh_token);
      if (index > -1) {
        refreshTokens.splice(index, 1);
      }
      
      return res.status(401).json({
        success: false,
        message: 'Refresh token expirado'
      });
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign(
      { 
        id: tokenData.userId, 
        username: tokenData.username, 
        role: tokenData.role,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Respuesta exitosa con nuevo access token
    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      access_token: newAccessToken,
      expires_in: 900, // 15 minutos en segundos
      token_type: 'Bearer'
    });

  } catch (error) {
    console.error('Error en refresh:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;