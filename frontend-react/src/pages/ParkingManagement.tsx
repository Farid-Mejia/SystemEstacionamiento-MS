import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ParkingCircle, Construction } from 'lucide-react'

export function ParkingManagement() {
  return (
    <Layout title="Gestión de Estacionamiento">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Estacionamiento</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ParkingCircle className="w-6 h-6" />
              <span>Gestión de Estacionamiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Construction className="w-16 h-16 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700">Página en Construcción</h3>
              <p className="text-gray-500 text-center max-w-md">
                Esta funcionalidad está en desarrollo. Aquí podrás gestionar los espacios de estacionamiento,
                configurar tarifas, y administrar la disponibilidad de espacios.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}