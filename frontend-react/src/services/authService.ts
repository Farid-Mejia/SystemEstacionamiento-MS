import { LoginRequest, AuthResponse, ApiResponse } from '@/types';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');
const BASIC_USERNAME = import.meta.env.VITE_API_BASIC_USERNAME || 'parksystem_api';
const BASIC_PASSWORD = import.meta.env.VITE_API_BASIC_PASSWORD || 'ParkSystem2024!SecureAPI';

// Crear las credenciales de Basic Auth
const basicAuthCredentials = btoa(`${BASIC_USERNAME}:${BASIC_PASSWORD}`);

// Función para realizar peticiones HTTP con Basic Auth
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuthCredentials}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `Error HTTP: ${response.status}`,
        error: errorData.error || 'Error en la petición',
      };
    }

    const data = await response.json();

    // Si la respuesta del backend ya tiene la estructura correcta
    if (data.success !== undefined) {
      return data;
    }

    // Si no, envolvemos la respuesta
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
          error: 'La petición tardó demasiado en responder',
        };
      }

      return {
        success: false,
        message: 'Error de conexión',
        error: error.message,
      };
    }

    return {
      success: false,
      message: 'Error desconocido',
      error: 'Ocurrió un error inesperado',
    };
  }
};

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiRequest<AuthResponse>('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.username, // Corregido: ahora enviamos username como espera el backend
          password: credentials.password,
        }),
      });

      // Si la respuesta es exitosa y contiene los datos directamente
      if (response.success && response.data) {
        return response;
      }

      // Si la respuesta del backend viene directamente sin envolver en data
      if (response.success && (response as any).token) {
        return {
          success: true,
          data: response as any,
          message: (response as any).message || 'Login exitoso',
        };
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Error al intentar iniciar sesión',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  },

  async validateToken(token: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await apiRequest<{ valid: boolean }>('/api/users/validate', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.valid,
          message: 'Token validado correctamente',
        };
      }

      return {
        success: false,
        message: response.message || 'Error al validar token',
        error: response.error,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al validar token',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  },

  async refreshToken(token: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiRequest<AuthResponse>('/api/users/refresh', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });

      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Error al renovar token',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  },

  // Función auxiliar para obtener el token del localStorage
  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Función auxiliar para guardar el token en localStorage
  setStoredToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  // Función auxiliar para eliminar el token del localStorage
  removeStoredToken(): void {
    localStorage.removeItem('auth_token');
  },

  // Función auxiliar para obtener el usuario del localStorage
  getStoredUser(): any | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Función auxiliar para guardar el usuario en localStorage
  setStoredUser(user: any): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
  },

  // Función auxiliar para eliminar el usuario del localStorage
  removeStoredUser(): void {
    localStorage.removeItem('auth_user');
  },
};
