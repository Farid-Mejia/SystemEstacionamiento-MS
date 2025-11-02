import { ReactNode, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, ArrowRight, ArrowLeft, User, Users, BarChart3, Settings, ChevronDown, ParkingCircle, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { hasPermission } = useRoleAccess()
  const [isGestionOpen, setIsGestionOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGestionOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, []);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      permission: 'dashboard' as const,
    },
    {
      label: 'Ingreso de Vehículos',
      icon: ArrowRight,
      path: '/vehicles/entry',
      permission: 'vehicle-entry' as const,
    },
    {
      label: 'Salida de Vehículos',
      icon: ArrowLeft,
      path: '/vehicles/exit',
      permission: 'vehicle-exit' as const,
    },
    {
      label: 'Reportes',
      icon: BarChart3,
      path: '/reports',
      permission: 'reports' as const,
    },
  ].filter(item => hasPermission(item.permission));

  const gestionItems = [
    {
      label: 'Usuarios',
      icon: Users,
      path: '/users',
      permission: 'user-management' as const,
    },
    {
      label: 'Estacionamiento',
      icon: ParkingCircle,
      path: '/parking',
      permission: 'parking-management' as const,
    },
    {
      label: 'Visitantes',
      icon: UserCheck,
      path: '/visitors',
      permission: 'visitor-management' as const,
    },
  ].filter(item => hasPermission(item.permission));

  const isGestionActive = gestionItems.some((item) => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">ParkSystem</h1>
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
                  <span>
                    {user.firstName} {user.paternalLastName}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/profile')} 
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Mi Perfil</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
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
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Button key={item.path} variant={isActive ? 'default' : 'outline'} size="sm" onClick={() => navigate(item.path)} className={cn('flex items-center space-x-2', isActive && 'bg-blue-600 hover:bg-blue-700')}>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Dropdown de Gestión - Solo mostrar si hay elementos disponibles */}
              {gestionItems.length > 0 && (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant={isGestionActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsGestionOpen(!isGestionOpen)}
                    className={cn(
                      "flex items-center space-x-2",
                      isGestionActive && "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Gestión</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      isGestionOpen && "rotate-180"
                    )} />
                  </Button>
                  
                  {isGestionOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {gestionItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        
                        return (
                          <button
                            key={item.path}
                            onClick={() => {
                              navigate(item.path)
                              setIsGestionOpen(false)
                            }}
                            className={cn(
                              "w-full flex items-center space-x-2 px-4 py-2 text-sm text-left hover:bg-gray-50",
                              isActive && "bg-blue-50 text-blue-600"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        )}

        <main>{children}</main>
      </div>
    </div>
  );
}
