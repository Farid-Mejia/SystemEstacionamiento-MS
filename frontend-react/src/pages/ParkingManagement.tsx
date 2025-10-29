import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BarChart3,
  MapPin,
  Accessibility,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { parkingService } from '@/services/parkingService';
import { 
  ParkingSpace, 
  ParkingSpaceStats, 
  CreateParkingSpaceRequest, 
  UpdateParkingSpaceRequest,
  ParkingSpaceFormData 
} from '@/types';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ParkingManagement: React.FC = () => {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<ParkingSpace[]>([]);
  const [stats, setStats] = useState<ParkingSpaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    floor: 'ALL',
    status: 'ALL',
    isDisabledSpace: null as boolean | null
  });

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Estados para formulario
  const [formData, setFormData] = useState<ParkingSpaceFormData>({
    spaceNumber: 0,
    floor: 'SS',
    isDisabledSpace: false,
    status: 'available'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Cargar datos iniciales
  useEffect(() => {
    loadSpaces();
    loadStats();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    filterSpaces();
  }, [spaces, filters, searchTerm]);

  // Cargar formData cuando se selecciona un espacio para editar
  useEffect(() => {
    if (selectedSpace && isModalOpen) {
      setFormData({
        spaceNumber: selectedSpace.spaceNumber,
        floor: selectedSpace.floor,
        isDisabledSpace: selectedSpace.isDisabledSpace,
        status: selectedSpace.status
      });
    } else if (!selectedSpace && isModalOpen) {
      resetForm();
    }
  }, [selectedSpace, isModalOpen]);

  const loadSpaces = async () => {
    setLoading(true);
    try {
      const response = await parkingService.getParkingSpaces();
      if (response.success && response.data) {
        setSpaces(response.data);
      } else {
        toast.error(response.message || 'Error al cargar espacios');
        setSpaces([]);
      }
    } catch {
      toast.error('Error al cargar espacios');
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSpaces = () => {
    let filtered = [...spaces];

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(space =>
        space.spaceNumber.toString().includes(searchTerm.toLowerCase()) ||
        space.floor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por piso
    if (filters.floor !== 'ALL') {
      filtered = filtered.filter(space => space.floor === filters.floor);
    }

    // Filtro por estado
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(space => space.status === filters.status);
    }

    // Filtro por espacios para discapacitados
    if (filters.isDisabledSpace !== null) {
      filtered = filtered.filter(space => space.isDisabledSpace === filters.isDisabledSpace);
    }

    setFilteredSpaces(filtered);
  };

  const loadStats = async () => {
    try {
      const response = await parkingService.getStatistics();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch {
      console.error('Error al cargar estadísticas');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.spaceNumber || formData.spaceNumber <= 0) {
      errors.spaceNumber = 'El número de espacio es requerido y debe ser mayor a 0';
    }

    if (!formData.floor) {
      errors.floor = 'El piso es requerido';
    }

    if (!formData.status) {
      errors.status = 'El estado es requerido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      spaceNumber: 0,
      floor: 'SS',
      isDisabledSpace: false,
      status: 'available'
    });
    setFormErrors({});
  };

  const handleCreateSpace = async () => {
    if (!validateForm()) return;

    setModalLoading(true);
    try {
      const spaceData: CreateParkingSpaceRequest = {
        spaceNumber: formData.spaceNumber,
        floor: formData.floor,
        isDisabledSpace: formData.isDisabledSpace,
        status: formData.status
      };

      const response = await parkingService.createParkingSpace(spaceData);
      
      if (response.success) {
        toast.success('Espacio creado exitosamente');
        setIsModalOpen(false);
        resetForm();
        await loadSpaces();
        await loadStats();
      } else {
        toast.error(response.message || 'Error al crear espacio');
      }
    } catch {
      toast.error('Error al crear espacio');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateSpace = async () => {
    if (!selectedSpace || !validateForm()) return;
    
    setModalLoading(true);
    try {
      const spaceData: UpdateParkingSpaceRequest = {
        spaceNumber: formData.spaceNumber,
        floor: formData.floor,
        isDisabledSpace: formData.isDisabledSpace,
        status: formData.status
      };

      const response = await parkingService.updateParkingSpace(selectedSpace.id, spaceData);
      
      if (response.success) {
        toast.success('Espacio actualizado exitosamente');
        setIsModalOpen(false);
        setSelectedSpace(null);
        resetForm();
        await loadSpaces();
        await loadStats();
      } else {
        toast.error(response.message || 'Error al actualizar espacio');
      }
    } catch {
      toast.error('Error al actualizar espacio');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSpace = async () => {
    if (!selectedSpace) return;
    
    setModalLoading(true);
    try {
      const response = await parkingService.deleteParkingSpace(selectedSpace.id);
      
      if (response.success) {
        toast.success('Espacio eliminado exitosamente');
        setIsDeleteModalOpen(false);
        setSelectedSpace(null);
        await loadSpaces();
        await loadStats();
      } else {
        toast.error(response.message || 'Error al eliminar espacio');
      }
    } catch {
      toast.error('Error al eliminar espacio');
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'occupied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Ocupado';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'occupied':
        return 'destructive';
      case 'maintenance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Layout title="Gestión de Estacionamiento">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Car className="mr-2" />
                  Gestión de Estacionamiento
                </CardTitle>
                <p className="text-muted-foreground">
                  Administra los espacios de estacionamiento del sistema
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    loadSpaces();
                    loadStats();
                  }}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
                <Button
                  onClick={() => {
                    setSelectedSpace(null);
                    setIsModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Espacio
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar por número o piso..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="floor">Piso</Label>
                <select
                  id="floor"
                  value={filters.floor}
                  onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="ALL">Todos los pisos</option>
                  <option value="SS">Piso SS</option>
                  <option value="S1">Piso S1</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="available">Disponible</option>
                  <option value="occupied">Ocupado</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
              <div>
                <Label htmlFor="disabled">Espacios para discapacitados</Label>
                <select
                  id="disabled"
                  value={filters.isDisabledSpace === null ? 'ALL' : filters.isDisabledSpace.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters({ 
                      ...filters, 
                      isDisabledSpace: value === 'ALL' ? null : value === 'true'
                    });
                  }}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="ALL">Todos</option>
                  <option value="true">Solo discapacitados</option>
                  <option value="false">Solo regulares</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Total Espacios</p>
                    <p className="text-2xl font-semibold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                    <p className="text-2xl font-semibold">{stats.available}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Ocupados</p>
                    <p className="text-2xl font-semibold">{stats.occupied}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground">Mantenimiento</p>
                    <p className="text-2xl font-semibold">{stats.maintenance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de espacios */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Espacios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Piso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                        Cargando espacios...
                      </td>
                    </tr>
                  ) : filteredSpaces.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                        No se encontraron espacios
                      </td>
                    </tr>
                  ) : (
                    filteredSpaces.map((space) => (
                      <tr key={space.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm font-medium">
                              #{space.spaceNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm">{space.floor}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(space.status)}
                            <Badge 
                              variant={getStatusBadgeVariant(space.status)}
                              className="ml-2"
                            >
                              {getStatusText(space.status)}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {space.isDisabledSpace && (
                              <Accessibility className="h-4 w-4 text-blue-500 mr-1" />
                            )}
                            <span className="text-sm">
                              {space.isDisabledSpace ? 'Discapacitados' : 'Regular'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(space.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSpace(space);
                                setIsModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSpace(space);
                                setIsDeleteModalOpen(true);
                              }}
                              disabled={space.status === 'occupied'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal para crear/editar espacio */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedSpace ? 'Editar Espacio' : 'Nuevo Espacio'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="spaceNumber">Número de Espacio *</Label>
                <Input
                  id="spaceNumber"
                  type="number"
                  value={formData.spaceNumber || ''}
                  onChange={(e) => setFormData({ ...formData, spaceNumber: parseInt(e.target.value) || 0 })}
                  className={formErrors.spaceNumber ? 'border-red-500' : ''}
                />
                {formErrors.spaceNumber && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.spaceNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="floor">Piso *</Label>
                <select
                  id="floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value as 'SS' | 'S1' })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="SS">Piso SS</option>
                  <option value="S1">Piso S1</option>
                </select>
                {formErrors.floor && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.floor}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Estado *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' | 'occupied' | 'maintenance' })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="available">Disponible</option>
                  <option value="occupied">Ocupado</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
                {formErrors.status && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.status}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDisabledSpace"
                  checked={formData.isDisabledSpace}
                  onChange={(e) => setFormData({ ...formData, isDisabledSpace: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isDisabledSpace">Espacio para personas con discapacidad</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedSpace(null);
                    resetForm();
                  }}
                  disabled={modalLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={selectedSpace ? handleUpdateSpace : handleCreateSpace}
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Guardando...' : selectedSpace ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmación para eliminar */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                ¿Estás seguro de que deseas eliminar el espacio{' '}
                <strong>#{selectedSpace?.spaceNumber} ({selectedSpace?.floor})</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedSpace(null);
                  }}
                  disabled={modalLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteSpace}
                  disabled={modalLoading}
                >
                  {modalLoading ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export { ParkingManagement };
