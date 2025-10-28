import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Car, ParkingCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Autenticar con username y password
      const response = await authService.login({
        username: formData.username, // Enviamos el username directamente
        password: formData.password,
      });

      if (response.success) {
        // Manejar tanto la estructura envuelta como la directa
        const authData = response.data || response;

        if (authData && authData.token && authData.user) {
          // Guardar en localStorage usando las funciones del authService
          authService.setStoredToken(authData.token);
          authService.setStoredUser(authData.user);

          // Actualizar el store de Zustand
          login(authData.user, authData.token);

          toast.success(authData.message || 'Inicio de sesión exitoso');
          navigate('/dashboard');
        } else {
          toast.error('Respuesta del servidor incompleta');
        }
      } else {
        toast.error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradiente de fondo principal */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      
      {/* Patrón de puntos decorativo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute top-20 left-10 opacity-10">
        <Car className="w-32 h-32 text-white transform rotate-12" />
      </div>
      <div className="absolute top-40 right-20 opacity-10">
        <ParkingCircle className="w-24 h-24 text-white transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-10">
        <Shield className="w-28 h-28 text-white transform rotate-45" />
      </div>

      {/* Círculos decorativos con gradiente */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-3xl"></div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div className="w-full max-w-md">
          {/* Tarjeta de login mejorada */}
          <Card className="backdrop-blur-lg bg-white/95 shadow-2xl border-0 overflow-hidden">
            {/* Header con gradiente sutil */}
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Círculo de fondo con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-lg opacity-20 scale-110"></div>
                  <div className="relative p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
                    <Car className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Iniciar Sesión
              </CardTitle>
              <p className="text-slate-600 font-medium mt-2">Sistema de Gestión de Estacionamiento</p>
              
              {/* Línea decorativa */}
              <div className="flex justify-center mt-4">
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 font-medium">Usuario</Label>
                  <div className="relative">
                    <Input 
                      id="username" 
                      type="text" 
                      placeholder="admin" 
                      value={formData.username} 
                      onChange={(e) => handleInputChange('username', e.target.value)} 
                      className={`pl-4 pr-4 py-3 border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 ${
                        errors.username 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.username && <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.username}
                  </p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Contraseña</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password} 
                      onChange={(e) => handleInputChange('password', e.target.value)} 
                      className={`pl-4 pr-4 py-3 border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 ${
                        errors.password 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password}
                  </p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Iniciar Sesión
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
