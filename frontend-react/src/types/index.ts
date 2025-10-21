export interface User {
  id: number
  dni: string
  username: string
  first_name: string
  paternal_last_name: string
  maternal_last_name: string
  created_at: string
  updated_at: string
}

export interface Visitor {
  id: number
  dni: string
  first_name: string
  paternal_last_name: string
  maternal_last_name: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
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
  created_at: string
  updated_at: string
}

export interface ParkingSpace {
  id: number
  space_number: number
  floor: 'SS' | 'S1'
  status: 'available' | 'occupied' | 'maintenance'
  is_disabled_space: boolean
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
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