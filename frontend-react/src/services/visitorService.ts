import { Visitor, ApiResponse, CreateVisitorRequest, UpdateVisitorRequest } from '@/types';
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
    return {
      success: true,
      data,
      message: 'Operación exitosa',
    };
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

export const visitorService = {
  // Obtener todos los visitantes
  async getVisitors(): Promise<ApiResponse<Visitor[]>> {
    return apiRequest<Visitor[]>('/api/visitors');
  },

  // Obtener visitante por ID
  async getVisitorById(id: number): Promise<ApiResponse<Visitor>> {
    return apiRequest<Visitor>(`/api/visitors/${id}`);
  },

  // Obtener visitante por DNI
  async getVisitorByDni(dni: string): Promise<ApiResponse<Visitor>> {
    return apiRequest<Visitor>(`/api/visitors/dni/${dni}`);
  },

  // Crear nuevo visitante
  async createVisitor(visitorData: CreateVisitorRequest): Promise<ApiResponse<Visitor>> {
    return apiRequest<Visitor>('/api/visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    });
  },

  // Actualizar visitante
  async updateVisitor(id: number, visitorData: UpdateVisitorRequest): Promise<ApiResponse<Visitor>> {
    return apiRequest<Visitor>(`/api/visitors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(visitorData),
    });
  },

  // Eliminar visitante
  async deleteVisitor(id: number): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/visitors/${id}`, {
      method: 'DELETE',
    });
  },

  // Buscar visitantes por nombre o DNI
  async searchVisitors(searchTerm: string): Promise<ApiResponse<Visitor[]>> {
    const response = await this.getVisitors();

    if (!response.success || !response.data) {
      return response;
    }

    // Filtrar localmente por nombre o DNI
    // Los visitantes están en response.data.data (estructura de ms-visitors)
    const responseData = response.data as any;
    const visitors = Array.isArray(responseData.data) ? responseData.data : [];
    const filtered = visitors.filter((visitor: Visitor) => visitor.dni.toLowerCase().includes(searchTerm.toLowerCase()) || visitor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || visitor.paternalLastName.toLowerCase().includes(searchTerm.toLowerCase()) || visitor.maternalLastName.toLowerCase().includes(searchTerm.toLowerCase()));

    return {
      success: true,
      data: filtered,
      message: 'Búsqueda completada',
    };
  },
};
