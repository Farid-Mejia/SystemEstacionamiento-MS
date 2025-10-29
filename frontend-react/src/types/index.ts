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

export interface ParkingSpace {
  id: number
  space_number: number
  floor: 'SS' | 'S1'
  status: 'available' | 'occupied' | 'maintenance'
  is_disabled_space: boolean
  createdAt: string
  updatedAt: string
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