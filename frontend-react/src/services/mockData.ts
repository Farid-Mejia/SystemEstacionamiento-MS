import { User, Visitor, ParkingSpace, Vehicle, ParkingSession } from '@/types';

export const mockUsers: User[] = [
  {
    id: 1,
    dni: '12345678',
    username: 'admin',
    firstName: 'Juan Carlos',
    paternalLastName: 'Pérez',
    maternalLastName: 'García',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    dni: '87654321',
    username: 'operador',
    firstName: 'María Elena',
    paternalLastName: 'López',
    maternalLastName: 'Martínez',
    role: 'operator',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockVisitors: Visitor[] = [
  {
    id: 1,
    dni: '11111111',
    firstName: 'Juan Carlos',
    paternalLastName: 'Pérez',
    maternalLastName: 'García',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    dni: '22222222',
    firstName: 'María Elena',
    paternalLastName: 'López',
    maternalLastName: 'Martínez',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    dni: '33333333',
    firstName: 'Carlos Alberto',
    paternalLastName: 'Rodríguez',
    maternalLastName: 'Fernández',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockParkingSpaces: ParkingSpace[] = [
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    spaceNumber: i + 1,
    floor: 'SS' as const,
    status: i < 8 ? ('available' as const) : ('occupied' as const),
    isDisabledSpace: i === 0 || i === 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  })),
  ...Array.from({ length: 26 }, (_, i) => ({
    id: i + 15,
    spaceNumber: i + 15,
    floor: 'S1' as const,
    status: i < 15 ? ('available' as const) : ('occupied' as const),
    isDisabledSpace: i === 0 || i === 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
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
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
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
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
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
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
];
