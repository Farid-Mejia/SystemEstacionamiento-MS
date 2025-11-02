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
  },
  {
    id: 5,
    dni: '55667788',
    name: 'Luis Martínez',
    email: 'luis.martinez@cibertec.edu.pe'
  },
  {
    id: 6,
    dni: '99887766',
    name: 'Carmen Silva',
    email: 'carmen.silva@cibertec.edu.pe'
  },
  {
    id: 7,
    dni: '33445566',
    name: 'Roberto Vega',
    email: 'roberto.vega@cibertec.edu.pe'
  },
  {
    id: 8,
    dni: '77889900',
    name: 'Patricia Morales',
    email: 'patricia.morales@cibertec.edu.pe'
  },
  {
    id: 9,
    dni: '22334455',
    name: 'Diego Herrera',
    email: 'diego.herrera@cibertec.edu.pe'
  },
  {
    id: 10,
    dni: '66778899',
    name: 'Sofía Castillo',
    email: 'sofia.castillo@cibertec.edu.pe'
  },
  {
    id: 11,
    dni: '10203050',
    name: 'Ismael Omar Leonidas Hurtado Vargas',
    email: 'ismael.hurtado@cibertec.edu.pe'
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
  },
  {
    id: 4,
    user_id: 4,
    license_plate: 'GHI-789',
    model: 'Hyundai Elantra',
    color: 'Negro'
  },
  {
    id: 5,
    user_id: 5,
    license_plate: 'JKL-012',
    model: 'Mazda 3',
    color: 'Gris'
  },
  {
    id: 6,
    user_id: 6,
    license_plate: 'MNO-345',
    model: 'Volkswagen Jetta',
    color: 'Blanco'
  },
  {
    id: 7,
    user_id: 7,
    license_plate: 'PQR-678',
    model: 'Kia Forte',
    color: 'Azul'
  },
  {
    id: 8,
    user_id: 8,
    license_plate: 'STU-901',
    model: 'Chevrolet Cruze',
    color: 'Rojo'
  },
  {
    id: 9,
    user_id: 9,
    license_plate: 'VWX-234',
    model: 'Ford Focus',
    color: 'Verde'
  },
  {
    id: 10,
    user_id: 10,
    license_plate: 'YZA-567',
    model: 'Renault Logan',
    color: 'Plata'
  },
  {
    id: 11,
    user_id: 11,
    license_plate: 'ABC001',
    model: 'Toyota Yaris',
    color: 'Blanco'
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

// Sesiones de estacionamiento completadas (datos históricos de los últimos 6 meses)
export const completedParkingSessions = [
  // Enero 2024
  {
    id: 101,
    user_id: 1,
    vehicle_id: 1,
    space_id: 1, // SS-01
    entry_time: new Date('2024-01-02T08:15:00'),
    exit_time: new Date('2024-01-02T17:30:00'),
    total_amount: 18.50,
    status: 'completed'
  },
  {
    id: 102,
    user_id: 4,
    vehicle_id: 4,
    space_id: 9, // S1-15
    entry_time: new Date('2024-01-03T09:00:00'),
    exit_time: new Date('2024-01-03T12:45:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 103,
    user_id: 2,
    vehicle_id: 2,
    space_id: 5, // SS-11
    entry_time: new Date('2024-01-05T07:30:00'),
    exit_time: new Date('2024-01-05T18:15:00'),
    total_amount: 21.50,
    status: 'completed'
  },
  {
    id: 104,
    user_id: 7,
    vehicle_id: 7,
    space_id: 12, // S1-18
    entry_time: new Date('2024-01-08T10:20:00'),
    exit_time: new Date('2024-01-08T14:30:00'),
    total_amount: 8.25,
    status: 'completed'
  },
  {
    id: 105,
    user_id: 5,
    vehicle_id: 5,
    space_id: 2, // SS-02
    entry_time: new Date('2024-01-10T08:45:00'),
    exit_time: new Date('2024-01-10T16:20:00'),
    total_amount: 15.25,
    status: 'completed'
  },
  {
    id: 106,
    user_id: 8,
    vehicle_id: 8,
    space_id: 15, // S1-21
    entry_time: new Date('2024-01-12T11:10:00'),
    exit_time: new Date('2024-01-12T15:45:00'),
    total_amount: 9.25,
    status: 'completed'
  },
  {
    id: 107,
    user_id: 3,
    vehicle_id: 3,
    space_id: 7, // SS-13
    entry_time: new Date('2024-01-15T09:30:00'),
    exit_time: new Date('2024-01-15T13:15:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 108,
    user_id: 9,
    vehicle_id: 9,
    space_id: 18, // S1-24
    entry_time: new Date('2024-01-18T08:00:00'),
    exit_time: new Date('2024-01-18T17:45:00'),
    total_amount: 19.50,
    status: 'completed'
  },
  {
    id: 109,
    user_id: 6,
    vehicle_id: 6,
    space_id: 4, // SS-04
    entry_time: new Date('2024-01-20T10:15:00'),
    exit_time: new Date('2024-01-20T14:30:00'),
    total_amount: 8.50,
    status: 'completed'
  },
  {
    id: 110,
    user_id: 10,
    vehicle_id: 10,
    space_id: 22, // S1-28
    entry_time: new Date('2024-01-22T07:45:00'),
    exit_time: new Date('2024-01-22T16:30:00'),
    total_amount: 17.25,
    status: 'completed'
  },
  {
    id: 111,
    user_id: 11,
    vehicle_id: 11,
    space_id: 8, // SS-14
    entry_time: new Date('2024-01-25T09:20:00'),
    exit_time: new Date('2024-01-25T12:45:00'),
    total_amount: 6.75,
    status: 'completed'
  },
  {
    id: 112,
    user_id: 1,
    vehicle_id: 1,
    space_id: 25, // S1-31
    entry_time: new Date('2024-01-28T08:30:00'),
    exit_time: new Date('2024-01-28T18:00:00'),
    total_amount: 19.00,
    status: 'completed'
  },
  {
    id: 113,
    user_id: 4,
    vehicle_id: 4,
    space_id: 1, // SS-01
    entry_time: new Date('2024-01-30T11:00:00'),
    exit_time: new Date('2024-01-30T15:30:00'),
    total_amount: 9.00,
    status: 'completed'
  },

  // Febrero 2024
  {
    id: 114,
    user_id: 2,
    vehicle_id: 2,
    space_id: 13, // S1-19
    entry_time: new Date('2024-02-01T08:15:00'),
    exit_time: new Date('2024-02-01T17:45:00'),
    total_amount: 19.00,
    status: 'completed'
  },
  {
    id: 115,
    user_id: 7,
    vehicle_id: 7,
    space_id: 5, // SS-11
    entry_time: new Date('2024-02-03T09:30:00'),
    exit_time: new Date('2024-02-03T13:20:00'),
    total_amount: 7.75,
    status: 'completed'
  },
  {
    id: 116,
    user_id: 5,
    vehicle_id: 5,
    space_id: 19, // S1-25
    entry_time: new Date('2024-02-05T07:45:00'),
    exit_time: new Date('2024-02-05T16:15:00'),
    total_amount: 17.00,
    status: 'completed'
  },
  {
    id: 117,
    user_id: 8,
    vehicle_id: 8,
    space_id: 2, // SS-02
    entry_time: new Date('2024-02-08T10:00:00'),
    exit_time: new Date('2024-02-08T14:45:00'),
    total_amount: 9.50,
    status: 'completed'
  },
  {
    id: 118,
    user_id: 3,
    vehicle_id: 3,
    space_id: 26, // S1-32
    entry_time: new Date('2024-02-10T08:20:00'),
    exit_time: new Date('2024-02-10T12:30:00'),
    total_amount: 8.25,
    status: 'completed'
  },
  {
    id: 119,
    user_id: 9,
    vehicle_id: 9,
    space_id: 7, // SS-13
    entry_time: new Date('2024-02-12T11:15:00'),
    exit_time: new Date('2024-02-12T18:00:00'),
    total_amount: 13.50,
    status: 'completed'
  },
  {
    id: 120,
    user_id: 6,
    vehicle_id: 6,
    space_id: 16, // S1-22
    entry_time: new Date('2024-02-14T09:00:00'),
    exit_time: new Date('2024-02-14T15:30:00'),
    total_amount: 13.00,
    status: 'completed'
  },
  {
    id: 121,
    user_id: 10,
    vehicle_id: 10,
    space_id: 4, // SS-04
    entry_time: new Date('2024-02-16T08:45:00'),
    exit_time: new Date('2024-02-16T17:20:00'),
    total_amount: 17.25,
    status: 'completed'
  },
  {
    id: 122,
    user_id: 11,
    vehicle_id: 11,
    space_id: 29, // S1-35
    entry_time: new Date('2024-02-18T10:30:00'),
    exit_time: new Date('2024-02-18T14:15:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 123,
    user_id: 1,
    vehicle_id: 1,
    space_id: 8, // SS-14
    entry_time: new Date('2024-02-20T07:30:00'),
    exit_time: new Date('2024-02-20T16:45:00'),
    total_amount: 18.50,
    status: 'completed'
  },
  {
    id: 124,
    user_id: 4,
    vehicle_id: 4,
    space_id: 21, // S1-27
    entry_time: new Date('2024-02-22T09:15:00'),
    exit_time: new Date('2024-02-22T13:00:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 125,
    user_id: 2,
    vehicle_id: 2,
    space_id: 1, // SS-01
    entry_time: new Date('2024-02-25T08:00:00'),
    exit_time: new Date('2024-02-25T18:30:00'),
    total_amount: 21.00,
    status: 'completed'
  },
  {
    id: 126,
    user_id: 7,
    vehicle_id: 7,
    space_id: 32, // S1-38
    entry_time: new Date('2024-02-28T11:20:00'),
    exit_time: new Date('2024-02-28T15:45:00'),
    total_amount: 8.75,
    status: 'completed'
  },

  // Marzo 2024
  {
    id: 127,
    user_id: 5,
    vehicle_id: 5,
    space_id: 5, // SS-11
    entry_time: new Date('2024-03-02T08:30:00'),
    exit_time: new Date('2024-03-02T17:15:00'),
    total_amount: 17.50,
    status: 'completed'
  },
  {
    id: 128,
    user_id: 8,
    vehicle_id: 8,
    space_id: 14, // S1-20
    entry_time: new Date('2024-03-05T09:45:00'),
    exit_time: new Date('2024-03-05T13:30:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 129,
    user_id: 3,
    vehicle_id: 3,
    space_id: 2, // SS-02
    entry_time: new Date('2024-03-08T07:20:00'),
    exit_time: new Date('2024-03-08T16:45:00'),
    total_amount: 18.75,
    status: 'completed'
  },
  {
    id: 130,
    user_id: 9,
    vehicle_id: 9,
    space_id: 27, // S1-33
    entry_time: new Date('2024-03-10T10:15:00'),
    exit_time: new Date('2024-03-10T14:00:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 131,
    user_id: 6,
    vehicle_id: 6,
    space_id: 7, // SS-13
    entry_time: new Date('2024-03-12T08:45:00'),
    exit_time: new Date('2024-03-12T18:20:00'),
    total_amount: 19.25,
    status: 'completed'
  },
  {
    id: 132,
    user_id: 10,
    vehicle_id: 10,
    space_id: 17, // S1-23
    entry_time: new Date('2024-03-15T09:30:00'),
    exit_time: new Date('2024-03-15T15:45:00'),
    total_amount: 12.50,
    status: 'completed'
  },
  {
    id: 133,
    user_id: 11,
    vehicle_id: 11,
    space_id: 4, // SS-04
    entry_time: new Date('2024-03-18T11:00:00'),
    exit_time: new Date('2024-03-18T16:30:00'),
    total_amount: 11.00,
    status: 'completed'
  },
  {
    id: 134,
    user_id: 1,
    vehicle_id: 1,
    space_id: 23, // S1-29
    entry_time: new Date('2024-03-20T08:15:00'),
    exit_time: new Date('2024-03-20T17:00:00'),
    total_amount: 17.50,
    status: 'completed'
  },
  {
    id: 135,
    user_id: 4,
    vehicle_id: 4,
    space_id: 8, // SS-14
    entry_time: new Date('2024-03-22T10:45:00'),
    exit_time: new Date('2024-03-22T14:20:00'),
    total_amount: 7.25,
    status: 'completed'
  },
  {
    id: 136,
    user_id: 2,
    vehicle_id: 2,
    space_id: 30, // S1-36
    entry_time: new Date('2024-03-25T07:50:00'),
    exit_time: new Date('2024-03-25T16:15:00'),
    total_amount: 16.75,
    status: 'completed'
  },
  {
    id: 137,
    user_id: 7,
    vehicle_id: 7,
    space_id: 1, // SS-01
    entry_time: new Date('2024-03-28T09:20:00'),
    exit_time: new Date('2024-03-28T13:45:00'),
    total_amount: 8.75,
    status: 'completed'
  },
  {
    id: 138,
    user_id: 5,
    vehicle_id: 5,
    space_id: 20, // S1-26
    entry_time: new Date('2024-03-30T08:00:00'),
    exit_time: new Date('2024-03-30T18:45:00'),
    total_amount: 21.50,
    status: 'completed'
  },

  // Abril 2024
  {
    id: 139,
    user_id: 8,
    vehicle_id: 8,
    space_id: 5, // SS-11
    entry_time: new Date('2024-04-02T08:30:00'),
    exit_time: new Date('2024-04-02T16:20:00'),
    total_amount: 15.75,
    status: 'completed'
  },
  {
    id: 140,
    user_id: 3,
    vehicle_id: 3,
    space_id: 24, // S1-30
    entry_time: new Date('2024-04-05T09:15:00'),
    exit_time: new Date('2024-04-05T13:30:00'),
    total_amount: 8.50,
    status: 'completed'
  },
  {
    id: 141,
    user_id: 9,
    vehicle_id: 9,
    space_id: 2, // SS-02
    entry_time: new Date('2024-04-08T07:45:00'),
    exit_time: new Date('2024-04-08T17:30:00'),
    total_amount: 19.50,
    status: 'completed'
  },
  {
    id: 142,
    user_id: 6,
    vehicle_id: 6,
    space_id: 31, // S1-37
    entry_time: new Date('2024-04-10T10:20:00'),
    exit_time: new Date('2024-04-10T14:45:00'),
    total_amount: 8.75,
    status: 'completed'
  },
  {
    id: 143,
    user_id: 10,
    vehicle_id: 10,
    space_id: 7, // SS-13
    entry_time: new Date('2024-04-12T08:50:00'),
    exit_time: new Date('2024-04-12T18:15:00'),
    total_amount: 18.75,
    status: 'completed'
  },
  {
    id: 144,
    user_id: 11,
    vehicle_id: 11,
    space_id: 18, // S1-24
    entry_time: new Date('2024-04-15T09:30:00'),
    exit_time: new Date('2024-04-15T15:00:00'),
    total_amount: 11.00,
    status: 'completed'
  },
  {
    id: 145,
    user_id: 1,
    vehicle_id: 1,
    space_id: 4, // SS-04
    entry_time: new Date('2024-04-18T11:15:00'),
    exit_time: new Date('2024-04-18T16:45:00'),
    total_amount: 11.00,
    status: 'completed'
  },
  {
    id: 146,
    user_id: 4,
    vehicle_id: 4,
    space_id: 28, // S1-34
    entry_time: new Date('2024-04-20T08:00:00'),
    exit_time: new Date('2024-04-20T17:20:00'),
    total_amount: 18.50,
    status: 'completed'
  },
  {
    id: 147,
    user_id: 2,
    vehicle_id: 2,
    space_id: 8, // SS-14
    entry_time: new Date('2024-04-22T10:30:00'),
    exit_time: new Date('2024-04-22T14:15:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 148,
    user_id: 7,
    vehicle_id: 7,
    space_id: 15, // S1-21
    entry_time: new Date('2024-04-25T07:40:00'),
    exit_time: new Date('2024-04-25T16:30:00'),
    total_amount: 17.75,
    status: 'completed'
  },
  {
    id: 149,
    user_id: 5,
    vehicle_id: 5,
    space_id: 1, // SS-01
    entry_time: new Date('2024-04-28T09:00:00'),
    exit_time: new Date('2024-04-28T13:45:00'),
    total_amount: 9.50,
    status: 'completed'
  },
  {
    id: 150,
    user_id: 8,
    vehicle_id: 8,
    space_id: 33, // S1-39
    entry_time: new Date('2024-04-30T08:25:00'),
    exit_time: new Date('2024-04-30T18:00:00'),
    total_amount: 19.25,
    status: 'completed'
  },

  // Mayo 2024
  {
    id: 151,
    user_id: 3,
    vehicle_id: 3,
    space_id: 5, // SS-11
    entry_time: new Date('2024-05-03T08:15:00'),
    exit_time: new Date('2024-05-03T16:45:00'),
    total_amount: 17.00,
    status: 'completed'
  },
  {
    id: 152,
    user_id: 9,
    vehicle_id: 9,
    space_id: 22, // S1-28
    entry_time: new Date('2024-05-06T09:30:00'),
    exit_time: new Date('2024-05-06T13:20:00'),
    total_amount: 7.75,
    status: 'completed'
  },
  {
    id: 153,
    user_id: 6,
    vehicle_id: 6,
    space_id: 2, // SS-02
    entry_time: new Date('2024-05-08T07:50:00'),
    exit_time: new Date('2024-05-08T17:15:00'),
    total_amount: 18.75,
    status: 'completed'
  },
  {
    id: 154,
    user_id: 10,
    vehicle_id: 10,
    space_id: 19, // S1-25
    entry_time: new Date('2024-05-10T10:00:00'),
    exit_time: new Date('2024-05-10T14:30:00'),
    total_amount: 9.00,
    status: 'completed'
  },
  {
    id: 155,
    user_id: 11,
    vehicle_id: 11,
    space_id: 7, // SS-13
    entry_time: new Date('2024-05-13T08:45:00'),
    exit_time: new Date('2024-05-13T18:30:00'),
    total_amount: 19.50,
    status: 'completed'
  },
  {
    id: 156,
    user_id: 1,
    vehicle_id: 1,
    space_id: 26, // S1-32
    entry_time: new Date('2024-05-15T09:20:00'),
    exit_time: new Date('2024-05-15T15:45:00'),
    total_amount: 12.75,
    status: 'completed'
  },
  {
    id: 157,
    user_id: 4,
    vehicle_id: 4,
    space_id: 4, // SS-04
    entry_time: new Date('2024-05-17T11:00:00'),
    exit_time: new Date('2024-05-17T16:20:00'),
    total_amount: 10.50,
    status: 'completed'
  },
  {
    id: 158,
    user_id: 2,
    vehicle_id: 2,
    space_id: 34, // S1-40
    entry_time: new Date('2024-05-20T08:10:00'),
    exit_time: new Date('2024-05-20T17:40:00'),
    total_amount: 19.00,
    status: 'completed'
  },
  {
    id: 159,
    user_id: 7,
    vehicle_id: 7,
    space_id: 8, // SS-14
    entry_time: new Date('2024-05-22T10:35:00'),
    exit_time: new Date('2024-05-22T14:50:00'),
    total_amount: 8.50,
    status: 'completed'
  },
  {
    id: 160,
    user_id: 5,
    vehicle_id: 5,
    space_id: 16, // S1-22
    entry_time: new Date('2024-05-25T07:30:00'),
    exit_time: new Date('2024-05-25T16:00:00'),
    total_amount: 17.00,
    status: 'completed'
  },
  {
    id: 161,
    user_id: 8,
    vehicle_id: 8,
    space_id: 1, // SS-01
    entry_time: new Date('2024-05-28T09:15:00'),
    exit_time: new Date('2024-05-28T13:30:00'),
    total_amount: 8.50,
    status: 'completed'
  },
  {
    id: 162,
    user_id: 3,
    vehicle_id: 3,
    space_id: 29, // S1-35
    entry_time: new Date('2024-05-30T08:00:00'),
    exit_time: new Date('2024-05-30T18:45:00'),
    total_amount: 21.50,
    status: 'completed'
  },

  // Junio 2024
  {
    id: 163,
    user_id: 9,
    vehicle_id: 9,
    space_id: 5, // SS-11
    entry_time: new Date('2024-06-02T08:20:00'),
    exit_time: new Date('2024-06-02T16:30:00'),
    total_amount: 16.25,
    status: 'completed'
  },
  {
    id: 164,
    user_id: 6,
    vehicle_id: 6,
    space_id: 21, // S1-27
    entry_time: new Date('2024-06-05T09:45:00'),
    exit_time: new Date('2024-06-05T13:15:00'),
    total_amount: 7.00,
    status: 'completed'
  },
  {
    id: 165,
    user_id: 10,
    vehicle_id: 10,
    space_id: 2, // SS-02
    entry_time: new Date('2024-06-08T07:55:00'),
    exit_time: new Date('2024-06-08T17:20:00'),
    total_amount: 18.75,
    status: 'completed'
  },
  {
    id: 166,
    user_id: 11,
    vehicle_id: 11,
    space_id: 25, // S1-31
    entry_time: new Date('2024-06-10T10:10:00'),
    exit_time: new Date('2024-06-10T14:40:00'),
    total_amount: 9.00,
    status: 'completed'
  },
  {
    id: 167,
    user_id: 1,
    vehicle_id: 1,
    space_id: 7, // SS-13
    entry_time: new Date('2024-06-12T08:30:00'),
    exit_time: new Date('2024-06-12T18:15:00'),
    total_amount: 19.50,
    status: 'completed'
  },
  {
    id: 168,
    user_id: 4,
    vehicle_id: 4,
    space_id: 32, // S1-38
    entry_time: new Date('2024-06-15T09:00:00'),
    exit_time: new Date('2024-06-15T15:30:00'),
    total_amount: 13.00,
    status: 'completed'
  },
  {
    id: 169,
    user_id: 2,
    vehicle_id: 2,
    space_id: 4, // SS-04
    entry_time: new Date('2024-06-18T11:25:00'),
    exit_time: new Date('2024-06-18T16:50:00'),
    total_amount: 10.75,
    status: 'completed'
  },
  {
    id: 170,
    user_id: 7,
    vehicle_id: 7,
    space_id: 17, // S1-23
    entry_time: new Date('2024-06-20T08:05:00'),
    exit_time: new Date('2024-06-20T17:35:00'),
    total_amount: 19.00,
    status: 'completed'
  },
  {
    id: 171,
    user_id: 5,
    vehicle_id: 5,
    space_id: 8, // SS-14
    entry_time: new Date('2024-06-22T10:40:00'),
    exit_time: new Date('2024-06-22T14:25:00'),
    total_amount: 7.50,
    status: 'completed'
  },
  {
    id: 172,
    user_id: 8,
    vehicle_id: 8,
    space_id: 23, // S1-29
    entry_time: new Date('2024-06-25T07:25:00'),
    exit_time: new Date('2024-06-25T16:55:00'),
    total_amount: 19.00,
    status: 'completed'
  },
  {
    id: 173,
    user_id: 3,
    vehicle_id: 3,
    space_id: 1, // SS-01
    entry_time: new Date('2024-06-28T09:10:00'),
    exit_time: new Date('2024-06-28T13:40:00'),
    total_amount: 9.00,
    status: 'completed'
  },
  {
    id: 174,
    user_id: 9,
    vehicle_id: 9,
    space_id: 30, // S1-36
    entry_time: new Date('2024-06-30T08:15:00'),
    exit_time: new Date('2024-06-30T18:00:00'),
    total_amount: 19.50,
    status: 'completed'
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