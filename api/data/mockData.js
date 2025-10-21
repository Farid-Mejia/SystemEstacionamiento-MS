import bcrypt from 'bcrypt';

// Contraseñas encriptadas (la contraseña original es "123456" para todos)
const hashedPassword = await bcrypt.hash('123456', 10);

// Operadores del sistema
export const operators = [
  {
    id: 1,
    username: 'admin',
    password_hash: hashedPassword,
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    username: 'operador01',
    password_hash: hashedPassword,
    name: 'Operador 1',
    role: 'operator'
  },
  {
    id: 3,
    username: 'operador02',
    password_hash: hashedPassword,
    name: 'Operador 2',
    role: 'operator'
  }
];

// Usuarios con DNI (datos de prueba)
export const users = [
  {
    id: 1,
    dni: '12345678',
    name: 'Juan Pérez',
    email: 'juan.perez@cibertec.edu.pe'
  },
  {
    id: 2,
    dni: '87654321',
    name: 'María García',
    email: 'maria.garcia@cibertec.edu.pe'
  },
  {
    id: 3,
    dni: '11223344',
    name: 'Carlos López',
    email: 'carlos.lopez@cibertec.edu.pe'
  },
  {
    id: 4,
    dni: '44332211',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@cibertec.edu.pe'
  }
];

// Vehículos de prueba
export const vehicles = [
  {
    id: 1,
    user_id: 1,
    license_plate: 'ABC-123',
    model: 'Toyota Corolla',
    color: 'Blanco'
  },
  {
    id: 2,
    user_id: 2,
    license_plate: 'XYZ-789',
    model: 'Honda Civic',
    color: 'Azul'
  },
  {
    id: 3,
    user_id: 3,
    license_plate: 'DEF-456',
    model: 'Nissan Sentra',
    color: 'Rojo'
  }
];

// Espacios de estacionamiento (según documentación)
export const parkingSpaces = [
  // Piso SS (8 espacios)
  { id: 1, space_code: 'SS-01', floor_level: 'SS', is_available: true },
  { id: 2, space_code: 'SS-02', floor_level: 'SS', is_available: true },
  { id: 3, space_code: 'SS-03', floor_level: 'SS', is_available: false },
  { id: 4, space_code: 'SS-04', floor_level: 'SS', is_available: true },
  { id: 5, space_code: 'SS-11', floor_level: 'SS', is_available: true },
  { id: 6, space_code: 'SS-12', floor_level: 'SS', is_available: false },
  { id: 7, space_code: 'SS-13', floor_level: 'SS', is_available: true },
  { id: 8, space_code: 'SS-14', floor_level: 'SS', is_available: true },
  
  // Sótano S1 (32 espacios)
  { id: 9, space_code: 'S1-15', floor_level: 'S1', is_available: true },
  { id: 10, space_code: 'S1-16', floor_level: 'S1', is_available: true },
  { id: 11, space_code: 'S1-17', floor_level: 'S1', is_available: false },
  { id: 12, space_code: 'S1-18', floor_level: 'S1', is_available: true },
  { id: 13, space_code: 'S1-19', floor_level: 'S1', is_available: true },
  { id: 14, space_code: 'S1-20', floor_level: 'S1', is_available: true },
  { id: 15, space_code: 'S1-21', floor_level: 'S1', is_available: false },
  { id: 16, space_code: 'S1-22', floor_level: 'S1', is_available: true },
  { id: 17, space_code: 'S1-23', floor_level: 'S1', is_available: true },
  { id: 18, space_code: 'S1-24', floor_level: 'S1', is_available: true },
  { id: 19, space_code: 'S1-25', floor_level: 'S1', is_available: true },
  { id: 20, space_code: 'S1-26', floor_level: 'S1', is_available: true },
  { id: 21, space_code: 'S1-27', floor_level: 'S1', is_available: true },
  { id: 22, space_code: 'S1-28', floor_level: 'S1', is_available: true },
  { id: 23, space_code: 'S1-29', floor_level: 'S1', is_available: true },
  { id: 24, space_code: 'S1-30', floor_level: 'S1', is_available: true },
  { id: 25, space_code: 'S1-31', floor_level: 'S1', is_available: true },
  { id: 26, space_code: 'S1-32', floor_level: 'S1', is_available: true },
  { id: 27, space_code: 'S1-33', floor_level: 'S1', is_available: true },
  { id: 28, space_code: 'S1-34', floor_level: 'S1', is_available: true },
  { id: 29, space_code: 'S1-35', floor_level: 'S1', is_available: true },
  { id: 30, space_code: 'S1-36', floor_level: 'S1', is_available: true },
  { id: 31, space_code: 'S1-37', floor_level: 'S1', is_available: true },
  { id: 32, space_code: 'S1-38', floor_level: 'S1', is_available: true },
  { id: 33, space_code: 'S1-39', floor_level: 'S1', is_available: true },
  { id: 34, space_code: 'S1-40', floor_level: 'S1', is_available: true }
];

// Sesiones de estacionamiento activas
export const parkingSessions = [
  {
    id: 1,
    user_id: 1,
    vehicle_id: 1,
    space_id: 3, // SS-03
    entry_time: new Date('2024-01-15T08:30:00'),
    exit_time: null,
    total_amount: 0.00,
    status: 'active'
  },
  {
    id: 2,
    user_id: 2,
    vehicle_id: 2,
    space_id: 6, // SS-12
    entry_time: new Date('2024-01-15T09:15:00'),
    exit_time: null,
    total_amount: 0.00,
    status: 'active'
  },
  {
    id: 3,
    user_id: 3,
    vehicle_id: 3,
    space_id: 11, // S1-17
    entry_time: new Date('2024-01-15T07:45:00'),
    exit_time: null,
    total_amount: 0.00,
    status: 'active'
  }
];

// Credenciales de prueba para el usuario
// Almacenamiento en memoria para refresh tokens válidos
export const refreshTokens = [];

export const testCredentials = {
  admin: {
    username: 'admin',
    password: '123456',
    role: 'admin'
  },
  operator1: {
    username: 'operador01',
    password: '123456',
    role: 'operator'
  },
  operator2: {
    username: 'operador02',
    password: '123456',
    role: 'operator'
  }
};