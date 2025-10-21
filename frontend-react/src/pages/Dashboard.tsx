import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParkingStore } from '@/stores/parkingStore'
import { parkingService } from '@/services/parkingService'
import { Layout } from '@/components/Layout'
import { ParkingGrid } from '@/components/ParkingGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Car, 
  Building, 
  RefreshCw, 
  CheckCircle,
  Settings,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

export function Dashboard() {
  const navigate = useNavigate()
  const {
    spaces,
    sessions,
    setSpaces,
    setSessions,
    getSpacesByFloor,
    getAvailableSpaces,
    getOccupiedSpaces,
  } = useParkingStore()

  const [isLoading, setIsLoading] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState<'all' | 'SS' | 'S1'>('all')

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [spacesResponse, sessionsResponse] = await Promise.all([
        parkingService.getParkingSpaces(),
        parkingService.getSessions(),
      ])

      if (spacesResponse.success && spacesResponse.data) {
        setSpaces(spacesResponse.data)
      }

      if (sessionsResponse.success && sessionsResponse.data) {
        setSessions(sessionsResponse.data)
      }
    } catch (error) {
      toast.error('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const ssSpaces = getSpacesByFloor('SS')
  const s1Spaces = getSpacesByFloor('S1')
  const availableSpaces = getAvailableSpaces()
  const occupiedSpaces = getOccupiedSpaces()
  const activeSessions = sessions.filter(session => session.status === 'active')
  const maintenanceSpaces = spaces.filter(space => space.status === 'maintenance')

  // Calculate occupancy rate
  const occupancyRate = spaces.length > 0 ? Math.round((occupiedSpaces.length / spaces.length) * 100) : 0

  const getOccupancyColor = () => {
    if (occupancyRate > 90) return { text: 'text-red-600', bg: 'bg-red-100', bar: 'bg-red-400' }
    if (occupancyRate > 75) return { text: 'text-yellow-600', bg: 'bg-yellow-100', bar: 'bg-yellow-400' }
    if (occupancyRate > 50) return { text: 'text-blue-600', bg: 'bg-blue-100', bar: 'bg-blue-400' }
    return { text: 'text-green-600', bg: 'bg-green-100', bar: 'bg-green-400' }
  }

  const occupancyColors = getOccupancyColor()

  const mainStats = [
    {
      title: 'Total de Espacios',
      value: spaces.length,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Espacios Ocupados',
      value: occupiedSpaces.length,
      icon: Car,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Espacios Disponibles',
      value: availableSpaces.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'En Mantenimiento',
      value: maintenanceSpaces.length,
      icon: Settings,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    // KPI de ocupación integrado como una métrica más
    {
      title: '% de Ocupación',
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      color: occupancyColors.text,
      bgColor: occupancyColors.bg,
      isOccupancy: true,
    },
  ]

  const getSystemStatus = () => {
    if (occupancyRate > 90) return { status: 'critical', message: 'Capacidad crítica', color: 'text-red-600' }
    if (occupancyRate > 75) return { status: 'warning', message: 'Capacidad alta', color: 'text-yellow-600' }
    return { status: 'normal', message: '', color: 'text-green-600' }
  }

  const systemStatus = getSystemStatus()

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Header with Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Control
            </h1>
            <p className="text-gray-600 text-sm">
              Gestión del sistema de estacionamiento
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={loadData}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* System Status - Solo si hay alertas */}
        {systemStatus.message && (
          <Card className={`border-l-4 ${systemStatus.status === 'critical' ? 'border-red-500' : 'border-yellow-500'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-5 h-5 ${systemStatus.color}`} />
                <div>
                  <p className={`font-semibold ${systemStatus.color}`}>
                    {systemStatus.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    Actualizado: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Statistics - Ahora incluye el % de ocupación */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {mainStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      {/* Barra sutil solo para el % de ocupación */}
                      {stat.isOccupancy && (
                        <div className="mt-2">
                          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${occupancyColors.bar}`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {occupiedSpaces.length}/{spaces.length}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Parking Grid */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="w-5 h-5 text-blue-600" />
                Mapa de Estacionamiento
              </CardTitle>
              
              <div className="flex gap-2">
                <Button
                  variant={selectedFloor === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFloor('all')}
                >
                  Todos
                </Button>
                <Button
                  variant={selectedFloor === 'SS' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFloor('SS')}
                >
                  Piso SS
                </Button>
                <Button
                  variant={selectedFloor === 'S1' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFloor('S1')}
                >
                  Sótano S1
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Compact Legend */}
              <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-lg text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                  <span>Ocupado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
                  <span>Mantenimiento</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-200 border border-purple-300 rounded"></div>
                  <span>Discapacidad</span>
                </div>
              </div>

              {/* Parking Grids */}
              {(selectedFloor === 'all' || selectedFloor === 'SS') && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Primer Piso (SS)</h3>
                  <ParkingGrid
                    spaces={ssSpaces}
                    floor="SS"
                  />
                </div>
              )}

              {(selectedFloor === 'all' || selectedFloor === 'S1') && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Sótano (S1)</h3>
                  <ParkingGrid
                    spaces={s1Spaces}
                    floor="S1"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehículos Estacionados - Tabla */}
        {activeSessions.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-orange-600" />
                  Vehículos Estacionados
                </span>
                <Badge variant="secondary" className="text-sm">
                  {activeSessions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Placa
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Espacio
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Tiempo Estacionado
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.slice(0, 6).map((session) => {
                      const entryTime = new Date(session.entry_time)
                      const duration = Math.floor((Date.now() - entryTime.getTime()) / (1000 * 60))
                      const hours = Math.floor(duration / 60)
                      const minutes = duration % 60
                      
                      return (
                        <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">
                              {session.license_plate}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">
                              {session.parking_space_id}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">
                              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                duration > 120 ? 'border-orange-300 text-orange-700 bg-orange-50' : 
                                'border-green-300 text-green-700 bg-green-50'
                              }`}
                            >
                              {duration > 120 ? 'Estancia larga' : 'Normal'}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {activeSessions.length > 6 && (
                <div className="mt-4 text-center border-t border-gray-200 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/vehicles/exit')}
                  >
                    Ver todos los vehículos ({activeSessions.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}