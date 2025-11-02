import { verifyToken } from '../routes/auth.js';

// Middleware para verificar roles específicos
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Primero verificar el token
    verifyToken(req, res, (err) => {
      if (err) return; // Si hay error en verifyToken, ya se envió la respuesta

      // Verificar si el usuario tiene el rol requerido
      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a este recurso',
          required_roles: allowedRoles,
          user_role: userRole
        });
      }

      next();
    });
  };
};

// Middleware específico para solo ADMIN
export const requireAdmin = requireRole(['ADMIN']);

// Middleware específico para ADMIN y OPERATOR
export const requireAdminOrOperator = requireRole(['ADMIN', 'OPERATOR']);