export interface User {
  id: number
  dni: string
  username: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  role: string
  createdAt: string
  updatedAt: string
}

// Tipos adicionales para mantenimiento de usuarios
export interface CreateUserRequest {
  dni: string
  username: string
  password: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  role: 'ADMIN' | 'OPERATOR'
}

export interface UpdateUserRequest {
  dni?: string
  username?: string
  password?: string
  firstName?: string
  paternalLastName?: string
  maternalLastName?: string
  role?: 'ADMIN' | 'OPERATOR'
}

export interface UserFormData {
  dni: string
  username: string
  password: string
  confirmPassword: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  role: 'ADMIN' | 'OPERATOR'
}

export interface UserFilters {
  search: string
  role: 'ALL' | 'ADMIN' | 'OPERATOR'
}

export interface Visitor {
  id: number
  dni: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  createdAt: string
  updatedAt: string
}

// Tipos adicionales para mantenimiento de visitantes
export interface CreateVisitorRequest {
  dni: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
}

export interface UpdateVisitorRequest {
  dni?: string
  firstName?: string
  paternalLastName?: string
  maternalLastName?: string
}

export interface VisitorFormData {
  dni: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
}

export interface VisitorFilters {
  search: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface LoginRequest {
  username: string
  password: string
  remember?: boolean
}

export interface Vehicle {
  id: number
  license_plate: string
  owner_dni: string
  owner_name: string
  vehicle_type: string
  color: string
  brand: string
  model: string
  createdAt: string
  updatedAt: string
}

// Tipos actualizados para espacios de estacionamiento
export interface ParkingSpace {
  id: number
  spaceNumber: number
  floor: 'SS' | 'S1'
  status: 'available' | 'occupied' | 'maintenance'
  isDisabledSpace: boolean
  createdAt: string
  updatedAt: string
}

// DTOs para espacios de estacionamiento
export interface CreateParkingSpaceRequest {
  spaceNumber: number
  floor: 'SS' | 'S1'
  isDisabledSpace?: boolean
  status?: 'available' | 'occupied' | 'maintenance'
}

export interface UpdateParkingSpaceRequest {
  spaceNumber?: number
  floor?: 'SS' | 'S1'
  isDisabledSpace?: boolean
  status?: 'available' | 'occupied' | 'maintenance'
}

export interface ParkingSpaceFormData {
  spaceNumber: number
  floor: 'SS' | 'S1'
  isDisabledSpace: boolean
  status: 'available' | 'occupied' | 'maintenance'
}

export interface ParkingSpaceFilters {
  search: string
  floor: 'ALL' | 'SS' | 'S1'
  status: 'ALL' | 'available' | 'occupied' | 'maintenance'
  isDisabledSpace: 'ALL' | 'true' | 'false'
}

export interface ParkingSpaceStats {
  total: number
  available: number
  occupied: number
  maintenance: number
  disabled: number
}

export interface ParkingSession {
  id: number
  license_plate: string
  visitor_id: number
  parking_space_id: number
  entry_time: string
  exit_time?: string
  duration_seconds?: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface VehicleRegistrationRequest {
  license_plate: string
  space_number: number
  user_dni: string
  needs_disabled_space?: boolean
}

export interface VehicleEntryRequest {
  license_plate: string
  space_number: number
  entry_time: string
  visitor_id: number
  needs_disabled_space?: boolean
}

export interface VehicleExitRequest {
  license_plate: string
  exit_time: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  total?: number
}

export interface ParkingFloor {
  name: string
  displayName: string
  spaces: number[]
}

export interface VehicleInfo {
  license_plate: string
  space_number: number
  entry_time?: string
  duration_seconds?: number
}