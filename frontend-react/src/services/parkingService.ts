import { 
  ParkingSpace, 
  Vehicle, 
  ParkingSession, 
  Visitor,
  VehicleRegistrationRequest,
  VehicleEntryRequest,
  VehicleExitRequest,
  ApiResponse 
} from '@/types'
import { mockParkingSpaces, mockVehicles, mockSessions, mockVisitors } from './mockData'

const API_DELAY = 1000

const simulateApiCall = <T>(data: T): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data,
        message: 'Operación exitosa',
      })
    }, API_DELAY)
  })
}

const simulateApiError = (message: string): Promise<ApiResponse<never>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: false,
        message,
      })
    }, API_DELAY)
  })
}

export const parkingService = {
  async getParkingSpaces(): Promise<ApiResponse<ParkingSpace[]>> {
    return simulateApiCall([...mockParkingSpaces])
  },

  async getVehicles(): Promise<ApiResponse<Vehicle[]>> {
    return simulateApiCall([...mockVehicles])
  },

  async getSessions(): Promise<ApiResponse<ParkingSession[]>> {
    return simulateApiCall([...mockSessions])
  },

  async registerVehicle(vehicleData: VehicleRegistrationRequest): Promise<ApiResponse<Vehicle>> {
    const existingVehicle = mockVehicles.find(
      (v) => v.license_plate === vehicleData.license_plate
    )

    if (existingVehicle) {
      return simulateApiError('Ya existe un vehículo con esta placa')
    }

    const visitor = mockVisitors.find((v) => v.dni === vehicleData.user_dni)
    if (!visitor) {
      return simulateApiError('Visitante no encontrado')
    }

    const newVehicle: Vehicle = {
      id: mockVehicles.length + 1,
      license_plate: vehicleData.license_plate,
      owner_dni: visitor.dni,
      owner_name: `${visitor.first_name} ${visitor.paternal_last_name} ${visitor.maternal_last_name}`,
      vehicle_type: 'car',
      color: 'No especificado',
      brand: 'No especificado',
      model: 'No especificado',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockVehicles.push(newVehicle)
    return simulateApiCall(newVehicle)
  },

  async vehicleEntry(entryData: VehicleEntryRequest): Promise<ApiResponse<ParkingSession>> {
    let vehicle = mockVehicles.find((v) => v.license_plate === entryData.license_plate)
    
    // Si el vehículo no existe, lo registramos automáticamente
    if (!vehicle) {
      const visitor = mockVisitors.find((v) => v.id === entryData.visitor_id)
      if (!visitor) {
        return simulateApiError('Visitante no encontrado')
      }

      const newVehicle: Vehicle = {
        id: mockVehicles.length + 1,
        license_plate: entryData.license_plate,
        owner_dni: visitor.dni,
        owner_name: `${visitor.first_name} ${visitor.paternal_last_name} ${visitor.maternal_last_name}`,
        vehicle_type: 'car',
        color: 'No especificado',
        brand: 'No especificado',
        model: 'No especificado',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockVehicles.push(newVehicle)
      vehicle = newVehicle
    }

    const space = mockParkingSpaces.find((s) => s.space_number === entryData.space_number)
    
    if (!space) {
      return simulateApiError('Espacio de estacionamiento no encontrado')
    }

    if (space.status === 'occupied') {
      return simulateApiError('El espacio ya está ocupado')
    }

    const activeSession = mockSessions.find(
      (s) => s.license_plate === vehicle.license_plate && s.status === 'active'
    )

    if (activeSession) {
      return simulateApiError('Vehículo ya registrado en el sistema')
    }

    const newSession: ParkingSession = {
      id: mockSessions.length + 1,
      license_plate: entryData.license_plate,
      visitor_id: entryData.visitor_id,
      parking_space_id: space.id,
      entry_time: new Date().toISOString(),
      exit_time: undefined,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockSessions.push(newSession)
    
    const spaceIndex = mockParkingSpaces.findIndex((s) => s.space_number === entryData.space_number)
    mockParkingSpaces[spaceIndex] = {
      ...space,
      status: 'occupied',
      updated_at: new Date().toISOString(),
    }

    return simulateApiCall(newSession)
  },

  async vehicleExit(exitData: VehicleExitRequest): Promise<ApiResponse<ParkingSession>> {
    const activeSession = mockSessions.find(
      (s) => s.license_plate === exitData.license_plate && s.status === 'active'
    )

    if (!activeSession) {
      return simulateApiError('No hay sesión activa para este vehículo')
    }

    const sessionIndex = mockSessions.findIndex((s) => s.id === activeSession.id)
    const updatedSession: ParkingSession = {
      ...activeSession,
      exit_time: new Date().toISOString(),
      status: 'completed',
      updated_at: new Date().toISOString(),
    }

    mockSessions[sessionIndex] = updatedSession

    const space = mockParkingSpaces.find((s) => s.id === activeSession.parking_space_id)
    if (space) {
      const spaceIndex = mockParkingSpaces.findIndex((s) => s.id === activeSession.parking_space_id)
      mockParkingSpaces[spaceIndex] = {
        ...space,
        status: 'available',
        updated_at: new Date().toISOString(),
      }
    }

    return simulateApiCall(updatedSession)
  },

  async getVehicleByDni(dni: string): Promise<ApiResponse<Vehicle[]>> {
    const vehicles = mockVehicles.filter((v) => v.owner_dni === dni)
    return simulateApiCall(vehicles)
  },

  async getVehicleByLicensePlate(licensePlate: string): Promise<ApiResponse<Vehicle | null>> {
    const vehicle = mockVehicles.find((v) => v.license_plate === licensePlate)
    return simulateApiCall(vehicle || null)
  },

  async getVisitorByDni(dni: string): Promise<ApiResponse<Visitor | null>> {
    const visitor = mockVisitors.find((v) => v.dni === dni)
    return simulateApiCall(visitor || null)
  },

  async createVisitor(visitorData: Omit<Visitor, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Visitor>> {
    const existingVisitor = mockVisitors.find((v) => v.dni === visitorData.dni)
    
    if (existingVisitor) {
      return simulateApiError('Ya existe un visitante con este DNI')
    }

    const newVisitor: Visitor = {
      id: mockVisitors.length + 1,
      ...visitorData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockVisitors.push(newVisitor)
    return simulateApiCall(newVisitor)
  },

  // Nuevos métodos para validar duplicados
  async checkDniInUse(dni: string): Promise<ApiResponse<boolean>> {
    // Primero encontrar el visitor por DNI
    const visitor = mockVisitors.find(v => v.dni === dni)
    if (!visitor) {
      return simulateApiCall(false)
    }
    
    // Luego buscar sesión activa con ese visitor_id
    const activeSession = mockSessions.find(
      (s) => s.visitor_id === visitor.id && s.status === 'active'
    )
    return simulateApiCall(!!activeSession)
  },

  async checkPlateInUse(licensePlate: string): Promise<ApiResponse<boolean>> {
    const activeSession = mockSessions.find(
      (s) => s.license_plate === licensePlate && s.status === 'active'
    )
    return simulateApiCall(!!activeSession)
  },
}