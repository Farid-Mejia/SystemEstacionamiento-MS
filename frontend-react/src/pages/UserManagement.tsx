import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Search, Edit, Trash2, RefreshCw, UserCheck, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '@/services/userService';
import { User, UserFormData, UserFilters, CreateUserRequest, UpdateUserRequest } from '@/types';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);

  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'ALL',
  });

  const [formData, setFormData] = useState<UserFormData>({
    dni: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    role: 'OPERATOR',
  });

  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});

  // Cargar usuarios
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getUsers();

      if (response.success && response.data) {
        // Los usuarios están directamente en response.data.data
        const responseData = response.data as any;
        const usersData = Array.isArray(responseData.data) ? responseData.data : [];
        setUsers(usersData);
        setFilteredUsers(usersData);
      } else {
        // En caso de error, asegurar que users sea un array vacío
        setUsers([]);
        setFilteredUsers([]);
        toast.error(response.message || 'Error al cargar usuarios');
      }
    } catch (error) {
      // En caso de excepción, asegurar que users sea un array vacío
      setUsers([]);
      setFilteredUsers([]);
      toast.error('Error al cargar usuarios');
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar usuarios
  useEffect(() => {
    // Asegurar que users es un array antes de filtrar
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    let filtered = users;

    // Filtro por búsqueda
    if (filters.search) {
      filtered = filtered.filter((user) => user.username.toLowerCase().includes(filters.search.toLowerCase()) || user.firstName?.toLowerCase().includes(filters.search.toLowerCase()) || user.paternalLastName?.toLowerCase().includes(filters.search.toLowerCase()));
    }

    // Filtro por rol
    if (filters.role !== 'ALL') {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  useEffect(() => {
    loadUsers();
  }, []);

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {};

    // Validar DNI
    if (!formData.dni.trim()) {
      errors.dni = 'El DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      errors.dni = 'El DNI debe tener exactamente 8 dígitos';
    }

    // Validar nombres
    if (!formData.firstName.trim()) {
      errors.firstName = 'Los nombres son requeridos';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'Los nombres deben tener al menos 2 caracteres';
    }

    // Validar apellido paterno
    if (!formData.paternalLastName.trim()) {
      errors.paternalLastName = 'El apellido paterno es requerido';
    } else if (formData.paternalLastName.length < 2) {
      errors.paternalLastName = 'El apellido paterno debe tener al menos 2 caracteres';
    }

    // Validar apellido materno
    if (!formData.maternalLastName.trim()) {
      errors.maternalLastName = 'El apellido materno es requerido';
    } else if (formData.maternalLastName.length < 2) {
      errors.maternalLastName = 'El apellido materno debe tener al menos 2 caracteres';
    }

    // Validar username
    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    // Validar password
    if (!editingUser && !formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de password
    if (!editingUser && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      dni: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
      role: 'OPERATOR',
    });
    setFormErrors({});
    setEditingUser(null);
  };

  // Abrir modal para crear usuario
  const handleCreateUser = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      dni: user.dni,
      username: user.username,
      password: '',
      confirmPassword: '',
      firstName: user.firstName,
      paternalLastName: user.paternalLastName,
      maternalLastName: user.maternalLastName,
      role: user.role as 'ADMIN' | 'OPERATOR',
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // Guardar usuario (crear o editar)
  const handleSaveUser = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editingUser) {
        // Editar usuario
        const updateData: UpdateUserRequest = {
          dni: formData.dni,
          username: formData.username,
          firstName: formData.firstName,
          paternalLastName: formData.paternalLastName,
          maternalLastName: formData.maternalLastName,
          role: formData.role,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await userService.updateUser(editingUser.id, updateData);
        if (response.success) {
          toast.success('Usuario actualizado exitosamente');
          loadUsers();
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast.error(response.message || 'Error al actualizar usuario');
        }
      } else {
        // Crear usuario
        const createData: CreateUserRequest = {
          dni: formData.dni,
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          paternalLastName: formData.paternalLastName,
          maternalLastName: formData.maternalLastName,
          role: formData.role,
        };

        const response = await userService.createUser(createData);
        if (response.success) {
          toast.success('Usuario creado exitosamente');
          loadUsers();
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast.error(response.message || 'Error al crear usuario');
        }
      }
    } catch (error) {
      toast.error('Error al guardar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (user: User) => {
    setIsLoading(true);
    try {
      const response = await userService.deleteUser(user.id);
      if (response.success) {
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
        setDeleteConfirm(null);
      } else {
        toast.error(response.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      toast.error('Error al eliminar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        <UserCheck className="w-3 h-3 mr-1" />
        Operador
      </Badge>
    );
  };

  return (
    <Layout title="Gestión de Usuarios">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 text-sm">Administra los usuarios del sistema</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={loadUsers} disabled={isLoading} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            <Button onClick={handleCreateUser} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <Input id="search" placeholder="Buscar por nombre de usuario..." value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <select id="role" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={filters.role} onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value as UserFilters['role'] }))}>
                  <option value="ALL">Todos los roles</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="OPERATOR">Operador</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(users) ? users.filter((u) => u.role === 'ADMIN').length : 0}</p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Operadores</p>
                  <p className="text-2xl font-bold text-gray-900">{Array.isArray(users) ? users.filter((u) => u.role === 'OPERATOR').length : 0}</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usuarios ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No se encontraron usuarios</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Rol</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Creado</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{user.username}</p>
                            {user.firstName && (
                              <p className="text-sm text-gray-500">
                                {user.firstName} {user.paternalLastName}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button onClick={() => handleEditUser(user)} variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => setDeleteConfirm(user)} variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de crear/editar usuario */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" value={formData.dni} onChange={(e) => setFormData((prev) => ({ ...prev, dni: e.target.value }))} placeholder="Ingrese el DNI (8 dígitos)" maxLength={8} />
                {formErrors.dni && <p className="text-sm text-red-600 mt-1">{formErrors.dni}</p>}
              </div>

              <div>
                <Label htmlFor="firstName">Nombres</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Ingrese los nombres" />
                {formErrors.firstName && <p className="text-sm text-red-600 mt-1">{formErrors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="paternalLastName">Apellido Paterno</Label>
                <Input id="paternalLastName" value={formData.paternalLastName} onChange={(e) => setFormData((prev) => ({ ...prev, paternalLastName: e.target.value }))} placeholder="Ingrese el apellido paterno" />
                {formErrors.paternalLastName && <p className="text-sm text-red-600 mt-1">{formErrors.paternalLastName}</p>}
              </div>

              <div>
                <Label htmlFor="maternalLastName">Apellido Materno</Label>
                <Input id="maternalLastName" value={formData.maternalLastName} onChange={(e) => setFormData((prev) => ({ ...prev, maternalLastName: e.target.value }))} placeholder="Ingrese el apellido materno" />
                {formErrors.maternalLastName && <p className="text-sm text-red-600 mt-1">{formErrors.maternalLastName}</p>}
              </div>

              <div>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input id="username" value={formData.username} onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))} placeholder="Ingrese el nombre de usuario" />
                {formErrors.username && <p className="text-sm text-red-600 mt-1">{formErrors.username}</p>}
              </div>

              <div>
                <Label htmlFor="password">{editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</Label>
                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))} placeholder={editingUser ? 'Dejar vacío para mantener actual' : 'Ingrese la contraseña'} />
                {formErrors.password && <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>}
              </div>

              {!editingUser && (
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Confirme la contraseña" />
                  {formErrors.confirmPassword && <p className="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>}
                </div>
              )}

              <div>
                <Label htmlFor="role">Rol</Label>
                <select id="role" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.role} onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as 'ADMIN' | 'OPERATOR' }))}>
                  <option value="OPERATOR">Operador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveUser} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingUser ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación de eliminación */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Confirmar Eliminación
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-gray-600">
                ¿Está seguro que desea eliminar al usuario <strong>{deleteConfirm?.username}</strong>?
              </p>
              <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => deleteConfirm && handleDeleteUser(deleteConfirm)} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
