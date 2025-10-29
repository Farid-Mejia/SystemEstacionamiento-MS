import { ParkingSpace, ApiResponse, CreateParkingSpaceRequest, UpdateParkingSpaceRequest, ParkingSpaceStats, ParkingSession } from '@/types';
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

  // Obtener sesiones de estacionamiento
  async getSessions(): Promise<ApiResponse<ParkingSession[]>> {
    return await apiRequest<ParkingSession[]>('/api/parking-sessions');
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

  // Registrar entrada de vehículo
  async vehicleEntry(entryData: any): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/api/parking-sessions/entry', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },

  // Registrar salida de vehículo
  async vehicleExit(exitData: any): Promise<ApiResponse<any>> {
    return await apiRequest<any>('/api/parking-sessions/exit', {
      method: 'POST',
      body: JSON.stringify(exitData),
    });
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
    return await apiRequest<any>(`/api/visitors/check-dni/${dni}`);
  },

  // Verificar si una placa está en uso
  async checkPlateInUse(licensePlate: string): Promise<ApiResponse<any>> {
    return await apiRequest<any>(`/api/vehicles/check-plate/${licensePlate}`);
  },
};
