import { useState, useEffect } from 'react';
import { useParkingStore } from '@/stores/parkingStore';
import { parkingService } from '@/services/parkingService';
import { visitorService } from '@/services/visitorService';
import { CreateParkingSessionRequest } from '@/types';
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

interface ParkingSession {
  id: number;
  licensePlate: string;
  parkingSpaceId: number;
  visitorId: number;
  entryTime: string;
  status: string;
}

interface Visitor {
  id: number;
  dni: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  fullName?: string;
}

interface FormData {
  userDni: string;
  licensePlate: string;
  needsDisabledSpace: boolean;
}

interface FormErrors {
  userDni?: string;
  licensePlate?: string;
}

// Enum para controlar el flujo progresivo
enum ValidationStep {
  DNI = 'dni',
  PLATE = 'plate',
  REGISTRATION = 'registration',
}

export function VehicleEntry() {
  const { spaces, selectedSpace, setSpaces, setSelectedSpace, addSession, getAvailableSpaces, getAvailableDisabledSpaces, validateSpaceAssignment } = useParkingStore();

  const [formData, setFormData] = useState<FormData>({
    userDni: '',
    licensePlate: '',
    needsDisabledSpace: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [userInfo, setUserInfo] = useState<any>(null);
  const [visitorSummary, setVisitorSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  // Estados para datos precargados
  const [activeSessions, setActiveSessions] = useState<ParkingSession[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  // Estados para el flujo progresivo
  const [currentStep, setCurrentStep] = useState<ValidationStep>(ValidationStep.DNI);
  const [validatedSteps, setValidatedSteps] = useState<Set<ValidationStep>>(new Set());
  const [plateValidated, setPlateValidated] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    console.log('🔄 DEBUG: Cargando datos iniciales...');
    await Promise.all([
      loadSpaces(),
      loadActiveSessions(),
      loadVisitors()
    ]);
  };

  const loadSpaces = async () => {
    try {
      console.log('🅿️ DEBUG: Cargando espacios de estacionamiento...');
      const response = await parkingService.getParkingSpaces();
      if (response.success && response.data) {
        setSpaces(response.data);
        console.log('🅿️ DEBUG: Espacios cargados exitosamente:', response.data.length);
      }
    } catch (error) {
      console.error('❌ DEBUG: Error al cargar espacios:', error);
      toast.error('Error al cargar los espacios');
    }
  };

  const loadActiveSessions = async () => {
    try {
      console.log('📊 DEBUG: Cargando sesiones activas...');
      const response = await parkingService.getAllParkingSessions();
      if (response.success && response.data) {
        console.log('📊 DEBUG: Total de sesiones obtenidas de la API:', response.data.length);
        
        // Mostrar algunos ejemplos de status para debug
        const statusExamples = response.data.slice(0, 3).map(session => ({
          id: session.id,
          status: session.status,
          visitorId: session.visitorId,
          licensePlate: session.licensePlate
        }));
        console.log('📊 DEBUG: Ejemplos de status de sesiones:', statusExamples);
        
        // Filtrar solo las sesiones activas - CORREGIDO: usar 'active' en minúsculas
        const activeSessions = response.data.filter(session => session.status === 'active');
        setActiveSessions(activeSessions);
        console.log('📊 DEBUG: Sesiones activas filtradas exitosamente:', activeSessions.length);
        
        // Mostrar detalles de sesiones activas para debug
        if (activeSessions.length > 0) {
          console.log('📊 DEBUG: Primeras sesiones activas:', activeSessions.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('❌ DEBUG: Error al cargar sesiones activas:', error);
      toast.error('Error al cargar las sesiones activas');
    }
  };

  const loadVisitors = async () => {
    try {
      console.log('👥 DEBUG: Cargando visitantes...');
      const response = await visitorService.getVisitors();
      if (response.success && response.data) {
        // Manejar la estructura de respuesta del microservicio de visitantes
        const visitorsData = Array.isArray(response.data) ? response.data : (response.data as any).data || [];
        setVisitors(visitorsData);
        console.log('👥 DEBUG: Visitantes cargados exitosamente:', visitorsData.length);
      }
    } catch (error) {
      console.error('❌ DEBUG: Error al cargar visitantes:', error);
      toast.error('Error al cargar los visitantes');
    }
  };

  const validateDni = (dni: string): boolean => {
    return /^\d{8}$/.test(dni);
  };

  const validatePlate = (plate: string): boolean => {
    return /^[A-Z]{3}\d{3}$/.test(plate);
  };

  const searchUserByDni = async () => {
    if (!formData.userDni.trim()) {
      toast.error('Ingrese un DNI válido');
      return;
    }

    if (!validateDni(formData.userDni)) {
      toast.error('El DNI debe tener exactamente 8 dígitos');
      setErrors((prev) => ({ ...prev, userDni: 'El DNI debe tener exactamente 8 dígitos' }));
      return;
    }

    setIsSearchingUser(true);
    setVisitorSummary(null); // Limpiar resumen anterior

    try {
      let visitor: Visitor | null = null;

      // PASO 1: Buscar primero en los datos locales de visitantes
      console.log('🔍 Buscando visitante por DNI en datos locales:', formData.userDni);
      const localVisitor = visitors.find(v => v.dni === formData.userDni);
      
      if (localVisitor) {
        console.log('✅ Visitante encontrado en datos locales:', localVisitor);
        visitor = localVisitor;
      } else {
        // PASO 2: Si no se encuentra localmente, buscar en la API
        console.log('🌐 Visitante no encontrado localmente, buscando en API...');
        const visitorResponse = await parkingService.getVisitorByDni(formData.userDni);
        
        if (visitorResponse.success && visitorResponse.data) {
          console.log('✅ Visitante encontrado en API:', visitorResponse.data);
          visitor = visitorResponse.data;
        }
      }

      if (visitor) {
        // Construir el nombre completo del visitante
        const fullName = visitor.fullName || `${visitor.firstName} ${visitor.paternalLastName} ${visitor.maternalLastName}`.trim();

        // PASO 3: Verificar si el visitante tiene sesiones activas usando datos locales
        console.log('🔍 Verificando sesiones activas para visitante ID:', visitor.id);
        console.log('🔍 Total de sesiones activas disponibles:', activeSessions.length);
        console.log('🔍 Sesiones activas completas:', activeSessions);
        
        const visitorActiveSessions = activeSessions.filter(session => {
          console.log(`🔍 Comparando: session.visitorId=${session.visitorId} con visitor.id=${visitor.id}, session.status='${session.status}'`);
          return session.visitorId === visitor.id && session.status === 'active';
        });

        console.log(`📊 Sesiones activas encontradas para visitante ${visitor.id}:`, visitorActiveSessions.length);
        console.log('📋 Detalles de sesiones activas del visitante:', visitorActiveSessions);

        if (visitorActiveSessions.length > 0) {
          // El visitante ya tiene vehículos estacionados
          console.log('⚠️ Visitante tiene sesiones activas:', visitorActiveSessions);
          const activeSession = visitorActiveSessions[0];
          const summary = {
            dni: visitor.dni,
            fullName: fullName,
            status: 'CON VEHÍCULO ESTACIONADO',
            licensePlate: activeSession.licensePlate || 'N/A',
            parkingSpace: activeSession.parkingSpaceId || 'N/A',
            entryTime: activeSession.entryTime || 'N/A',
          };

          setVisitorSummary(summary);
          toast.error('Este visitante ya tiene un vehículo estacionado');
          setErrors((prev) => ({ ...prev, userDni: 'Este DNI ya tiene un vehículo parqueado' }));
          return;
        }

        // El visitante existe pero no tiene sesiones activas
        console.log('✅ Visitante válido sin sesiones activas');
        const userInfo = {
          dni: visitor.dni,
          name: fullName,
          id: visitor.id,
        };

        const summary = {
          dni: visitor.dni,
          fullName: fullName,
          status: 'SIN VEHÍCULOS ESTACIONADOS',
          licensePlate: null,
          parkingSpace: null,
          entryTime: null,
        };

        setUserInfo(userInfo);
        setVisitorSummary(summary);
        setValidatedSteps((prev) => new Set([...prev, ValidationStep.DNI]));
        setCurrentStep(ValidationStep.PLATE);
        setErrors((prev) => ({ ...prev, userDni: undefined }));
        toast.success('Visitante encontrado - Ahora ingrese la placa del vehículo');
      } else {
        console.log('❌ Visitante no encontrado');
        toast.error('Visitante no encontrado con el DNI proporcionado');
        setErrors((prev) => ({ ...prev, userDni: 'Visitante no encontrado' }));
      }
    } catch (error) {
      console.error('❌ Error al buscar el visitante:', error);
      toast.error('Error al buscar el visitante. Verifique la conexión.');
      setErrors((prev) => ({ ...prev, userDni: 'Error al buscar el visitante' }));
    } finally {
      setIsSearchingUser(false);
    }
  };

  const validateLicensePlate = async () => {
    if (!formData.licensePlate.trim()) {
      toast.error('Ingrese una placa válida');
      return;
    }

    if (!validatePlate(formData.licensePlate)) {
      toast.error('La placa debe tener el formato ABC123');
      setErrors((prev) => ({ ...prev, licensePlate: 'La placa debe tener el formato ABC123' }));
      return;
    }

    // PASO 1: Verificar si la placa ya está en uso usando datos locales
    console.log('🔍 Verificando placa en sesiones activas locales:', formData.licensePlate);
    const existingSession = activeSessions.find(session => 
      session.licensePlate === formData.licensePlate && session.status === 'active'
    );

    if (existingSession) {
      console.log('⚠️ Placa encontrada en sesiones activas locales:', existingSession);
      toast.error('Esta placa ya tiene un vehículo registrado en el estacionamiento');
      setErrors((prev) => ({ ...prev, licensePlate: 'Esta placa ya está registrada' }));
      return;
    }

    // PASO 2: Si no se encuentra localmente, verificar en la API como fallback
    try {
      console.log('🌐 Placa no encontrada localmente, verificando en API...');
      const plateCheckResponse = await parkingService.checkPlateInUse(formData.licensePlate);
      if (plateCheckResponse.success && plateCheckResponse.data) {
        console.log('⚠️ Placa encontrada en API como registrada');
        toast.error('Esta placa ya tiene un vehículo registrado en el estacionamiento');
        setErrors((prev) => ({ ...prev, licensePlate: 'Esta placa ya está registrada' }));
        return;
      }
    } catch (error) {
      console.error('❌ Error checking plate:', error);
    }

    console.log('✅ Placa validada correctamente');
    setPlateValidated(true);
    setValidatedSteps((prev) => new Set([...prev, ValidationStep.PLATE]));
    setCurrentStep(ValidationStep.REGISTRATION);
    setErrors((prev) => ({ ...prev, licensePlate: undefined }));
    toast.success('Placa validada - Ahora seleccione un espacio y registre el ingreso');
  };

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
    if (field === 'licensePlate' && validatedSteps.has(ValidationStep.PLATE)) {
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
    if (formData.needsDisabledSpace && !space.isDisabledSpace) {
      toast.error('Debe seleccionar un espacio para personas con discapacidad');
      return;
    }

    if (!formData.needsDisabledSpace && space.isDisabledSpace) {
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
    const validation = validateSpaceAssignment(selectedSpace, formData.needsDisabledSpace);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      // Buscar el espacio seleccionado para obtener su ID real
      const selectedSpaceObject = spaces.find(s => s.spaceNumber === selectedSpace);
      if (!selectedSpaceObject) {
        toast.error('Error: No se pudo encontrar el espacio seleccionado');
        setIsLoading(false);
        return;
      }

      const entryData: CreateParkingSessionRequest = {
        licensePlate: formData.licensePlate.toUpperCase(),
        parkingSpaceId: selectedSpaceObject.id, // Usar el ID real del espacio, no el número
        visitorId: userInfo.id,
        entryTime: new Date().toISOString(),
      };

      const response = await parkingService.vehicleEntry(entryData);

      if (response.success) {
        if (response.data) {
          addSession(response.data);
        }

        // Recargar espacios para asegurar sincronización
        await loadSpaces();

        await Swal.fire({
          title: '¡Ingreso Registrado!',
          html: `
            <div class="text-left">
              <p><strong>Usuario:</strong> ${userInfo.name}</p>
              <p><strong>DNI:</strong> ${userInfo.dni}</p>
              <p><strong>Placa:</strong> ${formData.licensePlate}</p>
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
          licensePlate: '',
          needsDisabledSpace: false,
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

  const availableSpaces = formData.needsDisabledSpace ? getAvailableDisabledSpaces() : getAvailableSpaces();

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

                {visitorSummary && (
                  <div className={`p-3 border rounded-lg ${visitorSummary.status === 'CON VEHÍCULO ESTACIONADO' ? 'bg-red-100 border-red-200' : 'bg-green-100 border-green-200'}`}>
                    <h4 className={`font-medium mb-2 ${visitorSummary.status === 'CON VEHÍCULO ESTACIONADO' ? 'text-red-800' : 'text-green-800'}`}>{visitorSummary.status === 'CON VEHÍCULO ESTACIONADO' ? '⚠️ Visitante con Vehículo Estacionado' : '✓ Visitante Disponible'}</h4>
                    <div className={`text-sm space-y-1 ${visitorSummary.status === 'CON VEHÍCULO ESTACIONADO' ? 'text-red-700' : 'text-green-700'}`}>
                      <p>
                        <strong>Nombre:</strong> {visitorSummary.fullName}
                      </p>
                      <p>
                        <strong>DNI:</strong> {visitorSummary.dni}
                      </p>
                      <p>
                        <strong>Estado:</strong> {visitorSummary.status}
                      </p>
                      {visitorSummary.licensePlate && (
                        <>
                          <p>
                            <strong>Placa:</strong> {visitorSummary.licensePlate}
                          </p>
                          <p>
                            <strong>Espacio:</strong> {visitorSummary.parkingSpace}
                          </p>
                          <p>
                            <strong>Hora de Ingreso:</strong> {new Date(visitorSummary.entryTime).toLocaleString()}
                          </p>
                        </>
                      )}
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
                  <Label htmlFor="licensePlate">Placa del Vehículo</Label>
                  <div className="flex space-x-2">
                    <Input id="licensePlate" placeholder="ABC123" value={formData.licensePlate} onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())} className={errors.licensePlate ? 'border-red-500' : ''} maxLength={6} disabled={!validatedSteps.has(ValidationStep.DNI) || validatedSteps.has(ValidationStep.PLATE)} />
                    <Button onClick={validateLicensePlate} disabled={!validatedSteps.has(ValidationStep.DNI) || validatedSteps.has(ValidationStep.PLATE)} size="sm">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.licensePlate && <p className="text-sm text-red-500">{errors.licensePlate}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="needsDisabledSpace" checked={formData.needsDisabledSpace} onCheckedChange={(checked) => handleInputChange('needsDisabledSpace', checked as boolean)} disabled={!validatedSteps.has(ValidationStep.DNI)} />
                  <Label htmlFor="needsDisabledSpace" className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    <Accessibility className="w-4 h-4 text-purple-600" />
                    <span>Necesita espacio para discapacidad</span>
                  </Label>
                </div>

                {plateValidated && (
                  <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Placa validada: <strong>{formData.licensePlate}</strong>
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
                  {formData.needsDisabledSpace && (
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
                  {formData.needsDisabledSpace && (
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
