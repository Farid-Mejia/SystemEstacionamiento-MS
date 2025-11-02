import { useAuthStore } from '@/stores/authStore'

export type Permission = 
  | 'dashboard'
  | 'vehicle-entry'
  | 'vehicle-exit'
  | 'reports'
  | 'user-management'
  | 'parking-management'
  | 'visitor-management'

// Definir permisos por rol
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    'dashboard',
    'vehicle-entry',
    'vehicle-exit',
    'reports',
    'user-management',
    'parking-management',
    'visitor-management'
  ],
  OPERATOR: [
    'dashboard',
    'vehicle-entry',
    'vehicle-exit'
  ]
}

export function useRoleAccess() {
  const { user } = useAuthStore()

  const hasPermission = (permission: Permission): boolean => {
    if (!user || !user.role) {
      return false
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || []
    return userPermissions.includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN'
  }

  const isOperator = (): boolean => {
    return user?.role === 'OPERATOR'
  }

  const canAccessReports = (): boolean => {
    return hasPermission('reports')
  }

  const canAccessManagement = (): boolean => {
    return hasAnyPermission(['user-management', 'parking-management', 'visitor-management'])
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isOperator,
    canAccessReports,
    canAccessManagement,
    userRole: user?.role || null
  }
}