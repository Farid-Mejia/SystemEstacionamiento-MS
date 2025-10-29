import { ParkingSpace, ApiResponse, CreateParkingSpaceRequest, UpdateParkingSpaceRequest, ParkingSpaceStats, ParkingSession, CreateParkingSessionRequest, ExitParkingSessionRequest, ParkingSessionStats } from '@/types';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = 'http://localhost:8000';
const API_TIMEOUT = 10000;

// Función auxiliar para realizar peticiones HTTP con Bearer token
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  // Obtener el token del authStore
  const token = useAuthStore.getState().token;

  if (!token) {
    return {
      success: false,
      message: 'Token de autenticación no encontrado',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();

      // Intentar parsear el errorText como JSON para extraer solo el mensaje
      let errorMessage = errorText || response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson && errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        // Si no es JSON válido, usar el texto completo
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Tiempo de espera agotado',
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Error desconocido',
    };
  }
};

export const parkingService = {
  // Obtener todos los espacios de estacionamiento con filtros opcionales
  async getParkingSpaces(floor?: string, status?: string, isDisabledSpace?: boolean): Promise<ApiResponse<ParkingSpace[]>> {
    const params = new URLSearchParams();
    if (floor && floor !== 'ALL') params.append('floor', floor);
    if (status && status !== 'ALL') params.append('status', status.toUpperCase());
    if (isDisabledSpace !== undefined && isDisabledSpace !== null) {
      params.append('isDisabledSpace', isDisabledSpace.toString());
    }

    const queryString = params.toString();
    const endpoint = `/api/parking-spaces${queryString ? `?${queryString}` : ''}`;

    const response = await apiRequest<ParkingSpace[]>(endpoint);

    // Normalizar los datos para que coincidan con el frontend
    if (response.success && response.data) {
      response.data = response.data.map((space) => ({
        ...space,
        status: space.status.toLowerCase() as 'available' | 'occupied' | 'maintenance',
      }));
    }

    return response;
  },

  // Obtener espacio por ID
  async getParkingSpaceById(id: number): Promise<ApiResponse<ParkingSpace>> {
    const response = await apiRequest<ParkingSpace>(`/api/parking-spaces/${id}`);

    // Normalizar los datos para que coincidan con el frontend
    if (response.success && response.data) {
      response.data = {
        ...response.data,
        status: response.data.status.toLowerCase() as 'available' | 'occupied' | 'maintenance',
      };
    }

    return response;
  },

  // Obtener espacio por número
  async getParkingSpaceByNumber(spaceNumber: number): Promise<ApiResponse<ParkingSpace>> {
    const response = await apiRequest<ParkingSpace>(`/api/parking-spaces/number/${spaceNumber}`);

    // Normalizar los datos para que coincidan con el frontend
    if (response.success && response.data) {
      response.data = {
        ...response.data,
        status: response.data.status.toLowerCase() as 'available' | 'occupied' | 'maintenance',
      };
    }

    return response;
  },

  // Crear nuevo espacio de estacionamiento
  async createParkingSpace(spaceData: CreateParkingSpaceRequest): Promise<ApiResponse<ParkingSpace>> {
    // Convertir status a mayúsculas para la API
    const apiData = {
      ...spaceData,
      status: spaceData.status?.toUpperCase(),
    };

    const response = await apiRequest<ParkingSpace>('/api/parking-spaces', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });

    // Normalizar los datos para que coincidan con el frontend
    if (response.success && response.data) {
      response.data = {
        ...response.data,
        status: response.data.status.toLowerCase() as 'available' | 'occupied' | 'maintenance',
      };
    }

    return response;
  },

  // Actualizar espacio de estacionamiento
  async updateParkingSpace(id: number, spaceData: UpdateParkingSpaceRequest): Promise<ApiResponse<ParkingSpace>> {
    // Convertir status a mayúsculas para la API
    const apiData = {
      ...spaceData,
      status: spaceData.status?.toUpperCase(),
    };

    const response = await apiRequest<ParkingSpace>(`/api/parking-spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apiData),
    });

    // Normalizar los datos para que coincidan con el frontend
    if (response.success && response.data) {
      response.data = {
        ...response.data,
        status: response.data.status.toLowerCase() as 'available' | 'occupied' | 'maintenance',
      };
    }

    return response;
  },

  // Eliminar espacio de estacionamiento
  async deleteParkingSpace(id: number): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/parking-spaces/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener estadísticas de espacios de estacionamiento
  async getStatistics(): Promise<ApiResponse<ParkingSpaceStats>> {
    return apiRequest<ParkingSpaceStats>('/api/parking-spaces/stats');
  },

  // Buscar espacios por número
  async searchParkingSpaces(spaceNumber: string): Promise<ApiResponse<ParkingSpace[]>> {
    if (!spaceNumber.trim()) {
      return this.getParkingSpaces();
    }

    try {
      const number = parseInt(spaceNumber);
      if (isNaN(number)) {
        return {
          success: true,
          data: [],
          total: 0,
        };
      }

      const response = await this.getParkingSpaceByNumber(number);
      if (response.success && response.data) {
        return {
          success: true,
          data: [response.data],
          total: 1,
        };
      } else {
        return {
          success: true,
          data: [],
          total: 0,
        };
      }
    } catch {
      return {
        success: true,
        data: [],
        total: 0,
      };
    }
  },

  // ===== MÉTODOS PARA SESIONES DE ESTACIONAMIENTO =====

  // Obtener todas las sesiones de estacionamiento
  async getAllParkingSessions(): Promise<ApiResponse<ParkingSession[]>> {
    return await apiRequest<ParkingSession[]>('/api/parking-sessions');
  },

  // Obtener sesión por ID
  async getParkingSessionById(id: number): Promise<ApiResponse<ParkingSession>> {
    return await apiRequest<ParkingSession>(`/api/parking-sessions/${id}`);
  },

  // Crear nueva sesión de estacionamiento
  async createParkingSession(sessionData: CreateParkingSessionRequest): Promise<ApiResponse<ParkingSession>> {
    return await apiRequest<ParkingSession>('/api/parking-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  // Finalizar sesión de estacionamiento (salida)
  async exitParkingSession(id: number, exitData: ExitParkingSessionRequest): Promise<ApiResponse<ParkingSession>> {
    return await apiRequest<ParkingSession>(`/api/parking-sessions/${id}/exit`, {
      method: 'PUT',
      body: JSON.stringify(exitData),
    });
  },

  // Obtener sesiones activas por placa
  async getActiveSessionsByLicensePlate(licensePlate: string): Promise<ApiResponse<ParkingSession[]>> {
    return await apiRequest<ParkingSession[]>(`/api/parking-sessions/active?licensePlate=${encodeURIComponent(licensePlate)}`);
  },

  // Obtener sesiones por visitante
  async getSessionsByVisitorId(visitorId: number): Promise<ApiResponse<ParkingSession[]>> {
    return await apiRequest<ParkingSession[]>(`/api/parking-sessions/visitor/${visitorId}`);
  },

  // Obtener sesiones por espacio de estacionamiento
  async getSessionsByParkingSpaceId(spaceId: number): Promise<ApiResponse<ParkingSession[]>> {
    return await apiRequest<ParkingSession[]>(`/api/parking-sessions/space/${spaceId}`);
  },

  // Cancelar sesión
  async cancelParkingSession(id: number): Promise<ApiResponse<ParkingSession>> {
    return await apiRequest<ParkingSession>(`/api/parking-sessions/${id}/cancel`, {
      method: 'PUT',
    });
  },

  // Obtener estadísticas de sesiones
  async getParkingSessionStats(): Promise<ApiResponse<ParkingSessionStats>> {
    return await apiRequest<ParkingSessionStats>('/api/parking-sessions/stats');
  },

  // Método de compatibilidad (alias para getAllParkingSessions)
  async getSessions(): Promise<ApiResponse<ParkingSession[]>> {
    return this.getAllParkingSessions();
  },

  // Obtener visitante por DNI
  async getVisitorByDni(dni: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/api/visitors/dni/${dni}`);
  },

  // Obtener vehículo por placa
  async getVehicleByLicensePlate(licensePlate: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/api/vehicles/license-plate/${licensePlate}`);
  },

  // Obtener vehículos por DNI del propietario
  async getVehicleByDni(dni: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/api/vehicles/owner-dni/${dni}`);
  },

  // Registrar entrada de vehículo (crear sesión de estacionamiento)
  async vehicleEntry(entryData: CreateParkingSessionRequest): Promise<ApiResponse<ParkingSession>> {
    return this.createParkingSession(entryData);
  },

  // Registrar salida de vehículo (finalizar sesión de estacionamiento)
  async vehicleExit(sessionId: number, exitData: ExitParkingSessionRequest): Promise<ApiResponse<ParkingSession>> {
    return this.exitParkingSession(sessionId, exitData);
  },

  // Crear visitante
  async createVisitor(visitorData: any): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/api/visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    });
  },

  // Crear vehículo
  async createVehicle(vehicleData: any): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  // Verificar si un DNI está en uso
  async checkDniInUse(dni: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/api/visitors/dni/${dni}`);
  },

  // Verificar si una placa está en uso
  async checkPlateInUse(licensePlate: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/api/vehicles/check-plate/${licensePlate}`);
  },
};
