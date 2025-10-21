import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { VehicleEntry } from '@/pages/VehicleEntry'
import { VehicleExit } from '@/pages/VehicleExit'
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
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
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
