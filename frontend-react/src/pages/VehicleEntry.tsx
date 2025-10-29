import { useState, useEffect } from 'react';
import { useParkingStore } from '@/stores/parkingStore';
import { parkingService } from '@/services/parkingService';
import { VehicleEntryRequest } from '@/types';
import { Layout } from '@/components/Layout';
import { ParkingGrid } from '@/components/ParkingGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Search, Accessibility, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface FormData {
  userDni: string;
  license_plate: string;
  needs_disabled_space: boolean;
}

interface FormErrors {
  userDni?: string;
  license_plate?: string;
}

// Enum para controlar el flujo progresivo
enum ValidationStep {
  DNI = 'dni',
  PLATE = 'plate',
  REGISTRATION = 'registration',
}

export function VehicleEntry() {
  const { spaces, selectedSpace, setSpaces, setSelectedSpace, updateSpaceStatus, addSession, getAvailableSpaces, getAvailableDisabledSpaces, validateSpaceAssignment } = useParkingStore();

  const [formData, setFormData] = useState<FormData>({
    userDni: '',
    license_plate: '',
    needs_disabled_space: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  // Estados para el flujo progresivo
  const [currentStep, setCurrentStep] = useState<ValidationStep>(ValidationStep.DNI);
  const [validatedSteps, setValidatedSteps] = useState<Set<ValidationStep>>(new Set());
  const [plateValidated, setPlateValidated] = useState(false);

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const response = await parkingService.getParkingSpaces();
      if (response.success && response.data) {
        setSpaces(response.data);
      }
    } catch (error) {
      toast.error('Error al cargar los espacios');
    }
  };

  const validateDni = (dni: string): boolean => {
    return /^\d{8}$/.test(dni);
  };

  const validatePlate = (plate: string): boolean => {
    return /^[A-Z]{3}\d{3}$/.test(plate)
  }

  const searchUserByDni = async () => {
    if (!formData.userDni.trim()) {
      toast.error('Ingrese un DNI válido');
      return;
    }

    if (!validateDni(formData.userDni)) {
      toast.error('El DNI debe tener exactamente 8 dígitos');
      setErrors(prev => ({ ...prev, userDni: 'El DNI debe tener exactamente 8 dígitos' }))
      return
    }

    // Verificar si el DNI ya tiene un vehículo parqueado
    try {
      const dniCheckResponse = await parkingService.checkDniInUse(formData.userDni)
      if (dniCheckResponse.success && dniCheckResponse.data) {
        toast.error('Este DNI ya tiene un vehículo registrado en el estacionamiento')
        setErrors(prev => ({ ...prev, userDni: 'Este DNI ya tiene un vehículo parqueado' }))
        return
      }
    } catch (error) {
      console.error('Error checking DNI:', error)
    }

    setIsSearchingUser(true)
    try {
      // Simulamos búsqueda de usuario por DNI
      const mockUser = {
        dni: formData.userDni,
        name: `Usuario ${formData.userDni}`,
        email: `user${formData.userDni}@cibertec.edu.pe`,
      }
      
      setUserInfo(mockUser)
      setValidatedSteps(prev => new Set([...prev, ValidationStep.DNI]))
      setCurrentStep(ValidationStep.PLATE)
      setErrors(prev => ({ ...prev, userDni: undefined }))
      toast.success('Usuario encontrado - Ahora ingrese la placa del vehículo')
    } catch (error) {
      toast.error('Error al buscar el usuario')
    } finally {
      setIsSearchingUser(false)
    }
  }

  const validateLicensePlate = async () => {
    if (!formData.license_plate.trim()) {
      toast.error('Ingrese una placa válida')
      return
    }

    if (!validatePlate(formData.license_plate)) {
      toast.error('La placa debe tener el formato ABC123')
      setErrors(prev => ({ ...prev, license_plate: 'La placa debe tener el formato ABC123' }))
      return
    }

    // Verificar si la placa ya está en uso
    try {
      const plateCheckResponse = await parkingService.checkPlateInUse(formData.license_plate)
      if (plateCheckResponse.success && plateCheckResponse.data) {
        toast.error('Esta placa ya tiene un vehículo registrado en el estacionamiento')
        setErrors(prev => ({ ...prev, license_plate: 'Esta placa ya está registrada' }))
        return
      }
    } catch (error) {
      console.error('Error checking plate:', error)
    }

    setPlateValidated(true)
    setValidatedSteps(prev => new Set([...prev, ValidationStep.PLATE]))
    setCurrentStep(ValidationStep.REGISTRATION)
    setErrors(prev => ({ ...prev, license_plate: undefined }))
    toast.success('Placa validada - Ahora seleccione un espacio y registre el ingreso')
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores cuando el usuario modifica el campo
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Si cambia el DNI y ya estaba validado, resetear el flujo
    if (field === 'userDni' && validatedSteps.has(ValidationStep.DNI)) {
      setUserInfo(null);
      setValidatedSteps(new Set());
      setCurrentStep(ValidationStep.DNI);
      setPlateValidated(false);
      setSelectedSpace(null);
    }

    // Si cambia la placa y ya estaba validada, resetear desde ese paso
    if (field === 'license_plate' && validatedSteps.has(ValidationStep.PLATE)) {
      setPlateValidated(false);
      setValidatedSteps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ValidationStep.PLATE);
        newSet.delete(ValidationStep.REGISTRATION);
        return newSet;
      });
      setCurrentStep(ValidationStep.PLATE);
      setSelectedSpace(null);
    }
  };

  const handleSpaceSelection = (space_number: number) => {
    if (currentStep !== ValidationStep.REGISTRATION) {
      toast.error('Complete primero la validación del DNI y la placa');
      return;
    }

    const space = spaces.find((s) => s.spaceNumber === space_number);
    if (!space || space.status !== 'available') {
      toast.error('El espacio seleccionado no está disponible');
      return;
    }

    // Validar si el espacio es apropiado para las necesidades del usuario
    if (formData.needs_disabled_space && !space.isDisabledSpace) {
      toast.error('Debe seleccionar un espacio para personas con discapacidad');
      return;
    }

    if (!formData.needs_disabled_space && space.isDisabledSpace) {
      toast.error('Este espacio está reservado para personas con discapacidad');
      return;
    }

    setSelectedSpace(space_number);
  };

  const handleVehicleEntry = async () => {
    if (currentStep !== ValidationStep.REGISTRATION) {
      toast.error('Complete todas las validaciones primero');
      return;
    }

    if (!userInfo) {
      toast.error('Debe buscar y validar el usuario primero');
      return;
    }

    if (!plateValidated) {
      toast.error('Debe validar la placa del vehículo');
      return;
    }

    if (!selectedSpace) {
      toast.error('Debe seleccionar un espacio de estacionamiento');
      return;
    }

    // Validar asignación de espacio
    const validation = validateSpaceAssignment(selectedSpace, formData.needs_disabled_space);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      const entryData: VehicleEntryRequest = {
        license_plate: formData.license_plate.toUpperCase(),
        space_number: selectedSpace,
        entry_time: new Date().toISOString(),
        visitor_id: userInfo.dni,
        needs_disabled_space: formData.needs_disabled_space,
      };

      const response = await parkingService.vehicleEntry(entryData);

      if (response.success) {
        updateSpaceStatus(selectedSpace, 'occupied');

        if (response.data) {
          addSession(response.data);
        }

        await Swal.fire({
          title: '¡Ingreso Registrado!',
          html: `
            <div class="text-left">
              <p><strong>Usuario:</strong> ${userInfo.name}</p>
              <p><strong>DNI:</strong> ${userInfo.dni}</p>
              <p><strong>Placa:</strong> ${formData.license_plate}</p>
              <p><strong>Espacio:</strong> #${selectedSpace}</p>
              <p><strong>Hora de ingreso:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

        // Limpiar formulario y resetear flujo
        setFormData({
          userDni: '',
          license_plate: '',
          needs_disabled_space: false,
        });
        setUserInfo(null);
        setSelectedSpace(null);
        setValidatedSteps(new Set());
        setCurrentStep(ValidationStep.DNI);
        setPlateValidated(false);
      } else {
        toast.error(response.message || 'Error al registrar el ingreso');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const availableSpaces = formData.needs_disabled_space ? getAvailableDisabledSpaces() : getAvailableSpaces();

  const getStepIcon = (step: ValidationStep) => {
    if (validatedSteps.has(step)) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (currentStep === step) {
      return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <Layout title="Ingreso de Vehículos">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ingreso de Vehículos</h1>
          <p className="text-gray-600">Complete los datos del vehículo y seleccione un espacio de estacionamiento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lado izquierdo - Formulario progresivo */}
          <div className="lg:col-span-1 space-y-6">
            {/* Paso 1: Validación de DNI */}
            <Card className={`transition-all duration-300 ${currentStep === ValidationStep.DNI ? 'ring-2 ring-blue-500 bg-blue-50' : validatedSteps.has(ValidationStep.DNI) ? 'bg-green-50' : 'bg-gray-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  {getStepIcon(ValidationStep.DNI)}
                  <span>Paso 1: Validar DNI</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userDni">DNI de Visitante de Cibertec</Label>
                  <div className="flex space-x-2">
                    <Input id="userDni" placeholder="12345678" value={formData.userDni} onChange={(e) => handleInputChange('userDni', e.target.value)} maxLength={8} className={errors.userDni ? 'border-red-500' : ''} disabled={validatedSteps.has(ValidationStep.DNI)} />
                    <Button onClick={searchUserByDni} disabled={isSearchingUser || validatedSteps.has(ValidationStep.DNI)} size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.userDni && <p className="text-sm text-red-500">{errors.userDni}</p>}
                </div>

                {userInfo && (
                  <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-1">✓ Usuario Validado</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <p>
                        <strong>Nombre:</strong> {userInfo.name}
                      </p>
                      <p>
                        <strong>DNI:</strong> {userInfo.dni}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Paso 2: Validación de Placa */}
            <Card className={`transition-all duration-300 ${currentStep === ValidationStep.PLATE ? 'ring-2 ring-blue-500 bg-blue-50' : validatedSteps.has(ValidationStep.PLATE) ? 'bg-green-50' : 'bg-gray-50'} ${!validatedSteps.has(ValidationStep.DNI) ? 'opacity-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  {getStepIcon(ValidationStep.PLATE)}
                  <span>Paso 2: Validar Placa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="license_plate">Placa del Vehículo</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="license_plate"
                      placeholder="ABC123"
                      value={formData.license_plate}
                      onChange={(e) => handleInputChange('license_plate', e.target.value.toUpperCase())}
                      className={errors.license_plate ? 'border-red-500' : ''}
                      maxLength={6}
                      disabled={!validatedSteps.has(ValidationStep.DNI) || validatedSteps.has(ValidationStep.PLATE)}
                    />
                    <Button onClick={validateLicensePlate} disabled={!validatedSteps.has(ValidationStep.DNI) || validatedSteps.has(ValidationStep.PLATE)} size="sm">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.license_plate && <p className="text-sm text-red-500">{errors.license_plate}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needs_disabled_space"
                    checked={formData.needs_disabled_space}
                    onCheckedChange={(checked) => handleInputChange('needs_disabled_space', checked as boolean)}
                    disabled={!validatedSteps.has(ValidationStep.DNI)}
                  />
                  <Label htmlFor="needs_disabled_space" className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    <Accessibility className="w-4 h-4 text-purple-600" />
                    <span>Necesita espacio para discapacidad</span>
                  </Label>
                </div>

                {plateValidated && (
                  <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Placa validada: <strong>{formData.license_plate}</strong>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Paso 3: Registro */}
            <Card className={`transition-all duration-300 ${currentStep === ValidationStep.REGISTRATION ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-gray-50'} ${!validatedSteps.has(ValidationStep.PLATE) ? 'opacity-50' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  {getStepIcon(ValidationStep.REGISTRATION)}
                  <span>Paso 3: Registrar Ingreso</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleVehicleEntry} disabled={currentStep !== ValidationStep.REGISTRATION || !selectedSpace || isLoading} className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {isLoading ? 'Procesando...' : 'Registrar Ingreso'}
                </Button>
              </CardContent>
            </Card>


          </div>

          {/* Lado derecho - Selección de espacios */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Seleccionar Espacio - Primer Piso (SS)
                  {formData.needs_disabled_space && (
                    <span className="text-purple-600 ml-2">
                      <Accessibility className="w-4 h-4 inline" /> Espacios de Discapacidad
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ParkingGrid spaces={spaces.filter((s) => s.floor === 'SS')} floor="SS" onSpaceClick={handleSpaceSelection} selectedSpace={selectedSpace} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Seleccionar Espacio - Sótano (S1)
                  {formData.needs_disabled_space && (
                    <span className="text-purple-600 ml-2">
                      <Accessibility className="w-4 h-4 inline" /> Espacios de Discapacidad
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ParkingGrid spaces={spaces.filter((s) => s.floor === 'S1')} floor="S1" onSpaceClick={handleSpaceSelection} selectedSpace={selectedSpace} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
