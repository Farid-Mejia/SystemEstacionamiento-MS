import { User, Visitor, ParkingSpace, Vehicle, ParkingSession } from '@/types';

export const mockUsers: User[] = [
  {
    id: 1,
    dni: '12345678',
    username: 'admin',
    first_name: 'Juan Carlos',
    paternal_last_name: 'Pérez',
    maternal_last_name: 'García',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    dni: '87654321',
    username: 'operador',
    first_name: 'María Elena',
    paternal_last_name: 'López',
    maternal_last_name: 'Martínez',
    role: 'operator',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockVisitors: Visitor[] = [
  {
    id: 1,
    dni: '11111111',
    first_name: 'Juan Carlos',
    paternal_last_name: 'Pérez',
    maternal_last_name: 'García',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    dni: '22222222',
    first_name: 'María Elena',
    paternal_last_name: 'López',
    maternal_last_name: 'Martínez',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    dni: '33333333',
    first_name: 'Carlos Alberto',
    paternal_last_name: 'Rodríguez',
    maternal_last_name: 'Fernández',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockParkingSpaces: ParkingSpace[] = [
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    space_number: i + 1,
    floor: 'SS' as const,
    status: i < 8 ? ('available' as const) : ('occupied' as const),
    is_disabled_space: i === 0 || i === 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  })),
  ...Array.from({ length: 26 }, (_, i) => ({
    id: i + 15,
    space_number: i + 15,
    floor: 'S1' as const,
    status: i < 15 ? ('available' as const) : ('occupied' as const),
    is_disabled_space: i === 0 || i === 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  })),
];

export const mockVehicles: Vehicle[] = [
  {
    id: 1,
    license_plate: 'ABC123',
    owner_dni: '11111111',
    owner_name: 'Carlos López',
    vehicle_type: 'car',
    color: 'Azul',
    brand: 'Toyota',
    model: 'Corolla',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    license_plate: 'DEF456',
    owner_dni: '22222222',
    owner_name: 'Ana Martínez',
    vehicle_type: 'car',
    color: 'Rojo',
    brand: 'Honda',
    model: 'Civic',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const mockSessions: ParkingSession[] = [
  {
    id: 1,
    license_plate: 'ABC123',
    visitor_id: 1,
    parking_space_id: 9,
    entry_time: '2024-01-15T08:00:00Z',
    exit_time: undefined,
    status: 'active',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
  },
];
