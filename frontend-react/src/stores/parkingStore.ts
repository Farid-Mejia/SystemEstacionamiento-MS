import { create } from 'zustand'
import { ParkingSpace, Vehicle, ParkingSession } from '@/types'

interface ParkingState {
  spaces: ParkingSpace[]
  vehicles: Vehicle[]
  sessions: ParkingSession[]
  selectedSpace: number | null
  
  setSpaces: (spaces: ParkingSpace[]) => void
  updateSpaceStatus: (space_number: number, status: ParkingSpace['status']) => void
  setVehicles: (vehicles: Vehicle[]) => void
  addVehicle: (vehicle: Vehicle) => void
  setSessions: (sessions: ParkingSession[]) => void
  addSession: (session: ParkingSession) => void
  updateSession: (sessionId: number, updates: Partial<ParkingSession>) => void
  setSelectedSpace: (space_number: number | null) => void
  
  getSpacesByFloor: (floor: 'SS' | 'S1') => ParkingSpace[]
  getAvailableSpaces: (needs_disabled_space?: boolean) => ParkingSpace[]
  getOccupiedSpaces: () => ParkingSpace[]
  getDisabledSpaces: () => ParkingSpace[]
  getAvailableDisabledSpaces: () => ParkingSpace[]
  validateSpaceAssignment: (space_number: number, needs_disabled_space: boolean) => { valid: boolean; message?: string }
  getActiveSessionBySpace: (space_number: number) => ParkingSession | undefined
  getVehicleByLicensePlate: (licensePlate: string) => Vehicle | undefined
}

export const useParkingStore = create<ParkingState>((set, get) => ({
  spaces: [],
  vehicles: [],
  sessions: [],
  selectedSpace: null,
  
  setSpaces: (spaces) => set({ spaces }),
  
  updateSpaceStatus: (space_number, status) => {
    set((state) => ({
      spaces: state.spaces.map((space) =>
        space.spaceNumber === space_number
          ? { ...space, status, updatedAt: new Date().toISOString() }
          : space
      ),
    }))
  },
  
  setVehicles: (vehicles) => set({ vehicles }),
  
  addVehicle: (vehicle) => {
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
    }))
  },
  
  setSessions: (sessions) => set({ sessions }),
  
  addSession: (session) => {
    set((state) => ({
      sessions: [...state.sessions, session],
    }))
  },
  
  updateSession: (sessionId, updates) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      ),
    }))
  },
  
  setSelectedSpace: (space_number) => set({ selectedSpace: space_number }),
  
  getSpacesByFloor: (floor) => {
    return get().spaces.filter((space) => space.floor === floor)
  },
  
  getAvailableSpaces: (needs_disabled_space?: boolean) => {
    const availableSpaces = get().spaces.filter((space) => space.status === 'available')
    
    if (needs_disabled_space === true) {
      return availableSpaces.filter((space) => space.isDisabledSpace)
    } else if (needs_disabled_space === false) {
      return availableSpaces.filter((space) => !space.isDisabledSpace)
    }
    
    return availableSpaces
  },

  getOccupiedSpaces: () => {
    return get().spaces.filter((space) => space.status === 'occupied')
  },

  getDisabledSpaces: () => {
    return get().spaces.filter((space) => space.isDisabledSpace)
  },

  getAvailableDisabledSpaces: () => {
    return get().spaces.filter((space) => space.isDisabledSpace && space.status === 'available')
  },

  validateSpaceAssignment: (space_number, needs_disabled_space) => {
    const space = get().spaces.find((s) => s.spaceNumber === space_number)
    
    if (!space) {
      return { valid: false, message: 'Espacio no encontrado' }
    }
    
    if (space.status !== 'available') {
      return { valid: false, message: 'El espacio no está disponible' }
    }
    
    if (needs_disabled_space && !space.isDisabledSpace) {
      return { valid: false, message: 'Se requiere un espacio para personas con discapacidad' }
    }
    
    if (!needs_disabled_space && space.isDisabledSpace) {
      return { valid: false, message: 'Este espacio está reservado para personas con discapacidad' }
    }
    
    return { valid: true }
  },
  
  getActiveSessionBySpace: (space_number) => {
      return get().sessions.find(
        (session) => session.parkingSpaceId === space_number && session.status === 'active'
      )
    },
    getVehicleByLicensePlate: (licensePlate) => {
      return get().vehicles.find((vehicle) => vehicle.licensePlate === licensePlate)
    },
}))