import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { LogIn, Car } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    dni: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es requerido";
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener 8 dígitos";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Buscar el usuario por DNI en lugar de username
      const response = await authService.login({
        username: formData.dni, // El servicio espera username, pero enviamos el DNI
        password: formData.password,
      });

      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success("Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Error al iniciar sesión");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <p className="text-gray-600">
                Sistema de Gestión de Estacionamiento
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    type="text"
                    placeholder="12345678"
                    value={formData.dni}
                    onChange={(e) => handleInputChange("dni", e.target.value)}
                    className={errors.dni ? "border-red-500" : ""}
                    maxLength={8}
                  />
                  {errors.dni && (
                    <p className="text-sm text-red-500">{errors.dni}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    "Iniciando sesión..."
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Credenciales de prueba:
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>
                    Admin: DNI <strong>12345678</strong> / Contraseña:{" "}
                    <strong>password123</strong>
                  </div>
                  <div>
                    Operador: DNI <strong>87654321</strong> / Contraseña:{" "}
                    <strong>password123</strong>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
