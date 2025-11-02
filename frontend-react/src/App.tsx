import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { VehicleEntry } from '@/pages/VehicleEntry'
import { VehicleExit } from '@/pages/VehicleExit'
import { UserManagement } from '@/pages/UserManagement'
import { ParkingManagement } from '@/pages/ParkingManagement'
import { VisitorManagement } from '@/pages/VisitorManagement'
import { Profile } from '@/pages/Profile'
import Reports from '@/pages/Reports'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/vehicles/entry" 
            element={
              <ProtectedRoute>
                <VehicleEntry />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vehicles/exit" 
            element={
              <ProtectedRoute>
                <VehicleExit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <RoleProtectedRoute requiredPermission="user-management">
                <UserManagement />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/parking" 
            element={
              <RoleProtectedRoute requiredPermission="parking-management">
                <ParkingManagement />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/visitors" 
            element={
              <RoleProtectedRoute requiredPermission="visitor-management">
                <VisitorManagement />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <RoleProtectedRoute requiredPermission="reports">
                <Reports />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
        </Routes>
        
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </div>
    </Router>
  )
}

export default App
