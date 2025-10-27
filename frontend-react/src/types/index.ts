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

export interface Visitor {
  id: number
  dni: string
  firstName: string
  paternalLastName: string
  maternalLastName: string
  createdAt: string
  updatedAt: string
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
  licensePlate: string
  ownerDni: string
  ownerName: string
  vehicleType: string
  color: string
  brand: string
  model: string
  createdAt: string
  updatedAt: string
}

export interface ParkingSpace {
  id: number
  spaceNumber: number
  floor: 'SS' | 'S1'
  status: 'available' | 'occupied' | 'maintenance'
  isDisabledSpace: boolean
  createdAt: string
  updatedAt: string
}

export interface ParkingSession {
  id: number
  licensePlate: string
  visitorId: number
  parkingSpaceId: number
  entryTime: string
  exitTime?: string
  durationSeconds?: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface VehicleRegistrationRequest {
  licensePlate: string
  spaceNumber: number
  userDni: string
  needsDisabledSpace?: boolean
}

export interface VehicleEntryRequest {
  licensePlate: string
  spaceNumber: number
  entryTime: string
  visitorId: number
  needsDisabledSpace?: boolean
}

export interface VehicleExitRequest {
  licensePlate: string
  exitTime: string
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
  licensePlate: string
  spaceNumber: number
  entryTime?: string
  durationSeconds?: number
}