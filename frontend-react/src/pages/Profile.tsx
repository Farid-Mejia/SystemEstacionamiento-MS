import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export function Profile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    paternalLastName: user?.paternalLastName || '',
    maternalLastName: user?.maternalLastName || '',
    email: user?.email || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Aquí podrías hacer una llamada a la API para actualizar el perfil
    updateUser({
      ...user!,
      ...formData
    });
    setIsEditing(false);
    toast.success('Perfil actualizado correctamente');
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      paternalLastName: user?.paternalLastName || '',
      maternalLastName: user?.maternalLastName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'OPERATOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout title="Mi Perfil">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-1">Gestiona tu información personal y configuración de cuenta</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Editar Perfil</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal y datos de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombres</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paternalLastName">Apellido Paterno</Label>
                    <Input
                      id="paternalLastName"
                      value={formData.paternalLastName}
                      onChange={(e) => handleInputChange('paternalLastName', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="maternalLastName">Apellido Materno</Label>
                  <Input
                    id="maternalLastName"
                    value={formData.maternalLastName}
                    onChange={(e) => handleInputChange('maternalLastName', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de Cuenta */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Información de Cuenta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Usuario</Label>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                    {user.username}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">DNI</Label>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                    {user.dni}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Rol</Label>
                  <div className="mt-1">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">ID de Usuario</Label>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
                    #{user.id}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas de Sesión */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Actividad</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Última sesión</span>
                    <span className="text-sm font-medium">Hoy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sesiones totales</span>
                    <span className="text-sm font-medium">--</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tiempo activo</span>
                    <span className="text-sm font-medium">--</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}