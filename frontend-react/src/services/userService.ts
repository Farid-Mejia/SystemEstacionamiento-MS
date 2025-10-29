import { User, ApiResponse, CreateUserRequest, UpdateUserRequest } from '@/types';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = 'http://localhost:8000';
const API_TIMEOUT = 10000;

// Función auxiliar para realizar peticiones HTTP con Bearer token
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // Obtener el token del authStore
  const token = useAuthStore.getState().token;
  
  if (!token) {
    return {
      success: false,
      message: 'Token de autenticación no encontrado'
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
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Error ${response.status}: ${errorText || response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Operación exitosa'
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Tiempo de espera agotado'
        };
      }
      return {
        success: false,
        message: error.message
      };
    }
    
    return {
      success: false,
      message: 'Error desconocido'
    };
  }
};



export const userService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiRequest<User[]>('/api/users');
  },

  // Obtener usuario por ID
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return apiRequest<User>(`/api/users/${id}`);
  },

  // Crear nuevo usuario
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiRequest<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Actualizar usuario
  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Eliminar usuario
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Buscar usuarios por username
  async searchUsers(username: string): Promise<ApiResponse<User[]>> {
    return apiRequest<User[]>(`/api/users/search?username=${encodeURIComponent(username)}`);
  },

  // Filtrar usuarios por rol
  async getUsersByRole(role: 'ADMIN' | 'OPERATOR'): Promise<ApiResponse<User[]>> {
    return apiRequest<User[]>(`/api/users/role/${role}`);
  }
};