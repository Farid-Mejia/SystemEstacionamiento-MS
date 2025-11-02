import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useRoleAccess, Permission } from '@/hooks/useRoleAccess'
import { useAuthStore } from '@/stores/authStore'

interface RoleProtectedRouteProps {
  children: ReactNode
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAll?: boolean
  fallbackPath?: string
}

export function RoleProtectedRoute({ 
  children, 
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallbackPath = '/dashboard'
}: RoleProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore()
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRoleAccess()

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Verificar permisos
  let hasAccess = true

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission)
  } else if (requiredPermissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions)
  }

  // Si no tiene acceso, redirigir a la página de fallback
  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}