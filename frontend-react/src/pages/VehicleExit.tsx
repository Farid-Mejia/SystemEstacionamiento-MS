import { useState, useEffect } from 'react'
import { useParkingStore } from '@/stores/parkingStore'
import { parkingService } from '@/services/parkingService'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Search, Clock, User, Car, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { Vehicle, ParkingSession, Visitor } from '@/types'

type SearchType = 'dni' | 'plate'

export function VehicleExit() {
  const {
    sessions,
    updateSpaceStatus,
    updateSession,
    setSessions,
  } = useParkingStore()

  // Estados principales
  const [searchType, setSearchType] = useState<SearchType>('plate')
  const [searchValue, setSearchValue] = useState('')
  const [foundVehicles, setFoundVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null)
  const [visitorInfo, setVisitorInfo] = useState<Visitor | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await parkingService.getSessions()
      if (response.success && response.data) {
        setSessions(response.data)
      }
    } catch (error) {
      toast.error('Error al cargar las sesiones')
    }
  }

  const validateDni = (dni: string): boolean => {
    return /^\d{8}$/.test(dni)
  }

  const validatePlate = (plate: string): boolean => {
    return /^[A-Z]{3}\d{3}$/.test(plate)
  }

  const resetSearch = () => {
    setFoundVehicles([])
    setSelectedVehicle(null)
    setActiveSession(null)
    setVisitorInfo(null)
  }

  const searchVehicles = async () => {
    if (!searchValue.trim()) {
      toast.error(`Ingrese un ${searchType === 'dni' ? 'DNI' : 'placa'} válido`)
      return
    }

    // Validaciones específicas
    if (searchType === 'dni' && !validateDni(searchValue)) {
      toast.error('El DNI debe tener exactamente 8 dígitos')
      return
    }

    if (searchType === 'plate' && !validatePlate(searchValue)) {
      toast.error('Formato de placa inválido. Use ABC123 (3 letras + 3 números)')
      return
    }

    setIsSearching(true)
    resetSearch()

    try {
      if (searchType === 'dni') {
        // Buscar por DNI - puede retornar múltiples vehículos
        const vehiclesResponse = await parkingService.getVehicleByDni(searchValue)
        
        if (vehiclesResponse.success && vehiclesResponse.data && vehiclesResponse.data.length > 0) {
          // Filtrar solo vehículos con sesiones activas
          const vehiclesWithActiveSessions = vehiclesResponse.data.filter(vehicle => {
            return sessions.some(session => 
              session.license_plate === vehicle.license_plate && session.status === 'active'
            )
          })

          if (vehiclesWithActiveSessions.length === 0) {
            toast.error('Este DNI no tiene vehículos parqueados actualmente')
            return
          }

          setFoundVehicles(vehiclesWithActiveSessions)
          
          // Obtener información del visitante
          const visitorResponse = await parkingService.getVisitorByDni(searchValue)
          if (visitorResponse.success && visitorResponse.data) {
            setVisitorInfo(visitorResponse.data)
          }

          toast.success(`Se encontraron ${vehiclesWithActiveSessions.length} vehículo(s) parqueado(s)`)
        } else {
          toast.error('No se encontraron vehículos para este DNI')
        }
      } else {
        // Buscar por placa - retorna un solo vehículo
        const vehicleResponse = await parkingService.getVehicleByLicensePlate(searchValue.toUpperCase())
        
        if (vehicleResponse.success && vehicleResponse.data) {
          const vehicle = vehicleResponse.data
          
          // Verificar si tiene sesión activa
          const session = sessions.find(
            s => s.license_plate === vehicle.license_plate && s.status === 'active'
          )
          
          if (!session) {
            toast.error('Este vehículo no tiene una sesión activa')
            return
          }

          setFoundVehicles([vehicle])
          setSelectedVehicle(vehicle)
          setActiveSession(session)

          // Obtener información del visitante
          const visitorResponse = await parkingService.getVisitorByDni(vehicle.owner_dni)
          if (visitorResponse.success && visitorResponse.data) {
            setVisitorInfo(visitorResponse.data)
          }

          toast.success('Vehículo encontrado con sesión activa')
        } else {
          toast.error('Vehículo no encontrado')
        }
      }
    } catch (error) {
      toast.error('Error al buscar el vehículo')
    } finally {
      setIsSearching(false)
    }
  }

  const selectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    
    const session = sessions.find(
      s => s.license_plate === vehicle.license_plate && s.status === 'active'
    )
    
    if (session) {
      setActiveSession(session)
      toast.success('Vehículo seleccionado para salida')
    }
  }

  const calculateDuration = (entry_time: string) => {
    const entry = new Date(entry_time)
    const now = new Date()
    const diffMs = now.getTime() - entry.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${diffHours}h ${diffMinutes}m`
  }

  const handleVehicleExit = async () => {
    if (!selectedVehicle || !activeSession || !visitorInfo) {
      toast.error('No hay información válida para procesar la salida')
      return
    }

    const duration = calculateDuration(activeSession.entry_time)
    
    const result = await Swal.fire({
      title: 'Confirmar Salida',
      html: `
        <div class="text-left space-y-2">
          <div class="bg-blue-50 p-3 rounded-lg">
            <h4 class="font-semibold text-blue-800 mb-2">Información del Vehículo</h4>
            <p><strong>Placa:</strong> ${selectedVehicle.license_plate}</p>
            <p><strong>Propietario:</strong> ${selectedVehicle.owner_name}</p>
            <p><strong>DNI:</strong> ${visitorInfo.dni}</p>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <h4 class="font-semibold text-green-800 mb-2">Información de Estacionamiento</h4>
            <p><strong>Espacio:</strong> ${activeSession.parking_space_id}</p>
            <p><strong>Tiempo estacionado:</strong> ${duration}</p>
            <p><strong>Hora de ingreso:</strong> ${new Date(activeSession.entry_time).toLocaleString()}</p>
            <p><strong>Hora de salida:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar Salida',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      width: '500px',
    })

    if (!result.isConfirmed) return

    setIsLoading(true)
    try {
      const response = await parkingService.vehicleExit({
        license_plate: selectedVehicle.license_plate,
        exit_time: new Date().toISOString(),
      })

      if (response.success && response.data) {
        updateSpaceStatus(activeSession.parking_space_id, 'available')
        updateSession(activeSession.id, {
          exit_time: new Date().toISOString(),
          status: 'completed',
        })
        
        toast.success('Salida registrada exitosamente')
        
        // Limpiar formulario
        setSearchValue('')
        resetSearch()
      } else {
        toast.error(response.message || 'Error al registrar la salida')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const activeSessions = sessions.filter(s => s.status === 'active')

  return (
    <Layout title="Salida de Vehículos">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Salida de Vehículos
          </h1>
          <p className="text-gray-600">
            Registra la salida de un vehículo del estacionamiento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de búsqueda */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Buscar Vehículo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selector de tipo de búsqueda */}
                <div className="space-y-2">
                  <Label>Tipo de Búsqueda</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={searchType === 'plate' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSearchType('plate')
                        setSearchValue('')
                        resetSearch()
                      }}
                      className="flex items-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      Por Placa
                    </Button>
                    <Button
                      variant={searchType === 'dni' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setSearchType('dni')
                        setSearchValue('')
                        resetSearch()
                      }}
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Por DNI
                    </Button>
                  </div>
                </div>

                {/* Campo de búsqueda */}
                <div className="space-y-2">
                  <Label htmlFor="search">
                    {searchType === 'dni' ? 'DNI del Visitante' : 'Placa del Vehículo'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      placeholder={searchType === 'dni' ? '12345678' : 'ABC123'}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
                      maxLength={searchType === 'dni' ? 8 : 6}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          searchVehicles()
                        }
                      }}
                    />
                    <Button
                      onClick={searchVehicles}
                      disabled={isSearching}
                      size="sm"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {searchType === 'dni' 
                      ? 'Ingrese el DNI de 8 dígitos del visitante'
                      : 'Ingrese la placa en formato ABC123 (3 letras + 3 números)'
                    }
                  </p>
                </div>

                {/* Resultados de búsqueda por DNI */}
                {searchType === 'dni' && foundVehicles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">
                      Vehículos Encontrados ({foundVehicles.length})
                    </h4>
                    <div className="space-y-2">
                      {foundVehicles.map((vehicle) => {
                        const session = sessions.find(
                          s => s.license_plate === vehicle.license_plate && s.status === 'active'
                        )
                        return (
                          <div
                            key={vehicle.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedVehicle?.id === vehicle.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => selectVehicle(vehicle)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{vehicle.license_plate}</p>
                                <p className="text-sm text-gray-600">
                                  Espacio: {session?.parking_space_id}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Ingreso: {session ? new Date(session.entry_time).toLocaleString() : 'N/A'}
                                </p>
                              </div>
                              <div className="text-xs text-gray-500">
                                {session ? calculateDuration(session.entry_time) : 'N/A'}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Información del vehículo seleccionado */}
                {selectedVehicle && activeSession && visitorInfo && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">
                      Información de Salida
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-blue-700">Vehículo:</span>
                          <p className="text-blue-600">{selectedVehicle.license_plate}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">Propietario:</span>
                          <p className="text-blue-600">{selectedVehicle.owner_name}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">DNI:</span>
                          <p className="text-blue-600">{visitorInfo.dni}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-blue-700">Espacio:</span>
                          <p className="text-blue-600">{activeSession.parking_space_id}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">Ingreso:</span>
                          <p className="text-blue-600">{new Date(activeSession.entry_time).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">Duración:</span>
                          <p className="text-blue-600">{calculateDuration(activeSession.entry_time)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleVehicleExit}
                  disabled={!selectedVehicle || !activeSession || isLoading}
                  className="w-full"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {isLoading ? 'Procesando...' : 'Registrar Salida'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Panel de vehículos estacionados */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Vehículos Estacionados ({activeSessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No hay vehículos estacionados
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSearchType('plate')
                          setSearchValue(session.license_plate)
                          searchVehicles()
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-sm">
                            <p className="font-medium">Espacio {session.parking_space_id}</p>
                            <p className="text-gray-600">Placa: {session.license_plate}</p>
                            <p className="text-gray-600">
                              Ingreso: {new Date(session.entry_time).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {calculateDuration(session.entry_time)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}