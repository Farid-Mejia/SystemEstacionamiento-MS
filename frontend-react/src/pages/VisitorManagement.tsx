import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, Construction } from 'lucide-react'

export function VisitorManagement() {
  return (
    <Layout title="Gestión de Visitantes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Visitantes</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-6 h-6" />
              <span>Gestión de Visitantes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Construction className="w-16 h-16 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-700">Página en Construcción</h3>
              <p className="text-gray-500 text-center max-w-md">
                Esta funcionalidad está en desarrollo. Aquí podrás gestionar el registro de visitantes,
                asignar espacios temporales, y controlar el acceso de vehículos de visitantes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}