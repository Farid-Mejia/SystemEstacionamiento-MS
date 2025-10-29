import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck, Plus, Search, Edit, Trash2, RefreshCw, AlertTriangle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { visitorService } from '@/services/visitorService';
import { Visitor, VisitorFormData, VisitorFilters, CreateVisitorRequest, UpdateVisitorRequest } from '@/types';

export function VisitorManagement() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Visitor | null>(null);

  const [filters, setFilters] = useState<VisitorFilters>({
    search: '',
  });

  const [formData, setFormData] = useState<VisitorFormData>({
    dni: '',
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<VisitorFormData>>({});

  // Cargar visitantes
  const loadVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await visitorService.getVisitors();

      if (response.success && response.data) {
        // Los visitantes están directamente en response.data.data
        const responseData = response.data as any;
        const visitorsData = Array.isArray(responseData.data) ? responseData.data : [];
        setVisitors(visitorsData);
        setFilteredVisitors(visitorsData);
      } else {
        // En caso de error, asegurar que visitors sea un array vacío
        setVisitors([]);
        setFilteredVisitors([]);
        toast.error(response.message || 'Error al cargar visitantes');
      }
    } catch (error) {
      // En caso de excepción, asegurar que visitors sea un array vacío
      setVisitors([]);
      setFilteredVisitors([]);
      toast.error('Error al cargar visitantes');
      console.error('Error loading visitors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar visitantes
  useEffect(() => {
    // Asegurar que visitors es un array antes de filtrar
    if (!Array.isArray(visitors)) {
      setFilteredVisitors([]);
      return;
    }

    let filtered = visitors;

    // Filtro por búsqueda
    if (filters.search) {
      filtered = filtered.filter((visitor) => 
        visitor.dni.toLowerCase().includes(filters.search.toLowerCase()) ||
        visitor.firstName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        visitor.paternalLastName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        visitor.maternalLastName?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredVisitors(filtered);
  }, [visitors, filters]);

  useEffect(() => {
    loadVisitors();
  }, []);

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: Partial<VisitorFormData> = {};

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      dni: '',
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
    });
    setFormErrors({});
    setEditingVisitor(null);
  };

  // Abrir modal para crear visitante
  const handleCreateVisitor = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Abrir modal para editar visitante
  const handleEditVisitor = (visitor: Visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      dni: visitor.dni,
      firstName: visitor.firstName,
      paternalLastName: visitor.paternalLastName,
      maternalLastName: visitor.maternalLastName,
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  // Guardar visitante (crear o editar)
  const handleSaveVisitor = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editingVisitor) {
        // Editar visitante
        const updateData: UpdateVisitorRequest = {
          dni: formData.dni,
          firstName: formData.firstName,
          paternalLastName: formData.paternalLastName,
          maternalLastName: formData.maternalLastName,
        };

        const response = await visitorService.updateVisitor(editingVisitor.id, updateData);

        if (response.success) {
          toast.success('Visitante actualizado exitosamente');
          setIsDialogOpen(false);
          resetForm();
          loadVisitors();
        } else {
          toast.error(response.message || 'Error al actualizar visitante');
        }
      } else {
        // Crear visitante
        const createData: CreateVisitorRequest = {
          dni: formData.dni,
          firstName: formData.firstName,
          paternalLastName: formData.paternalLastName,
          maternalLastName: formData.maternalLastName,
        };

        const response = await visitorService.createVisitor(createData);

        if (response.success) {
          toast.success('Visitante creado exitosamente');
          setIsDialogOpen(false);
          resetForm();
          loadVisitors();
        } else {
          toast.error(response.message || 'Error al crear visitante');
        }
      }
    } catch (error) {
      toast.error('Error al guardar visitante');
      console.error('Error saving visitor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar visitante
  const handleDeleteVisitor = async (visitor: Visitor) => {
    setIsLoading(true);
    try {
      const response = await visitorService.deleteVisitor(visitor.id);

      if (response.success) {
        toast.success('Visitante eliminado exitosamente');
        setDeleteConfirm(null);
        loadVisitors();
      } else {
        toast.error(response.message || 'Error al eliminar visitante');
      }
    } catch (error) {
      toast.error('Error al eliminar visitante');
      console.error('Error deleting visitor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout title="Gestión de Visitantes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Visitantes</h1>
            <p className="text-gray-600 text-sm">Administra los visitantes del sistema</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={loadVisitors} disabled={isLoading} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            <Button onClick={handleCreateVisitor} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Visitante
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitantes</p>
                  <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visitantes Filtrados</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredVisitors.length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Buscar por DNI, nombres o apellidos..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de visitantes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitantes ({filteredVisitors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredVisitors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filters.search ? 'No se encontraron visitantes con los criterios de búsqueda.' : 'No hay visitantes registrados.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Visitante</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">DNI</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Creado</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {visitor.firstName} {visitor.paternalLastName} {visitor.maternalLastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {visitor.paternalLastName}, {visitor.maternalLastName}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {visitor.dni}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDate(visitor.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVisitor(visitor)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirm(visitor)}
                              className="text-red-600 hover:text-red-700"
                            >
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

        {/* Modal para crear/editar visitante */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingVisitor ? 'Editar Visitante' : 'Nuevo Visitante'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  placeholder="12345678"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className={formErrors.dni ? 'border-red-500' : ''}
                />
                {formErrors.dni && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.dni}</p>
                )}
              </div>

              <div>
                <Label htmlFor="firstName">Nombres *</Label>
                <Input
                  id="firstName"
                  placeholder="Juan Carlos"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={formErrors.firstName ? 'border-red-500' : ''}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="paternalLastName">Apellido Paterno *</Label>
                <Input
                  id="paternalLastName"
                  placeholder="García"
                  value={formData.paternalLastName}
                  onChange={(e) => setFormData({ ...formData, paternalLastName: e.target.value })}
                  className={formErrors.paternalLastName ? 'border-red-500' : ''}
                />
                {formErrors.paternalLastName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.paternalLastName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maternalLastName">Apellido Materno *</Label>
                <Input
                  id="maternalLastName"
                  placeholder="López"
                  value={formData.maternalLastName}
                  onChange={(e) => setFormData({ ...formData, maternalLastName: e.target.value })}
                  className={formErrors.maternalLastName ? 'border-red-500' : ''}
                />
                {formErrors.maternalLastName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.maternalLastName}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveVisitor}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingVisitor ? 'Actualizar' : 'Crear'}</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación para eliminar */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Confirmar Eliminación</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                ¿Estás seguro de que deseas eliminar al visitante{' '}
                <strong>
                  {deleteConfirm?.firstName} {deleteConfirm?.paternalLastName} {deleteConfirm?.maternalLastName}
                </strong>{' '}
                con DNI <strong>{deleteConfirm?.dni}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDeleteVisitor(deleteConfirm)}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>Eliminar</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}