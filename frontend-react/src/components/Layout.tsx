import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Car, 
  LogIn, 
  LogOut, 
  ArrowRight, 
  ArrowLeft,
  User,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export function Layout({ children, title }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      label: 'Ingreso de Vehículos',
      icon: ArrowRight,
      path: '/vehicles/entry',
    },
    {
      label: 'Salida de Vehículos',
      icon: ArrowLeft,
      path: '/vehicles/exit',
    },
    {
      label: 'Reportes',
      icon: BarChart3,
      path: '/reports',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                ParkSystem
              </h1>
              {title && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{title}</span>
                </>
              )}
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.first_name} {user.paternal_last_name}</span>

                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <nav className="mb-8">
            <div className="flex flex-wrap gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center space-x-2",
                      isActive && "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </nav>
        )}

        <main>{children}</main>
      </div>
    </div>
  )
}