import { LoginRequest, AuthResponse, ApiResponse } from "@/types";
import { mockUsers } from "./mockData";

const API_DELAY = 1000;

const simulateApiCall = <T>(data: T): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data,
        message: "Operación exitosa",
      });
    }, API_DELAY);
  });
};

const simulateApiError = (message: string): Promise<ApiResponse<never>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: false,
        message,
      });
    }, API_DELAY);
  });
};

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    // Buscar usuario por DNI (el username viene con el DNI desde el formulario)
    const user = mockUsers.find(
      (u) =>
        u.dni === credentials.username &&
        credentials.password === "password123",
    );

    if (!user) {
      return simulateApiError("DNI o contraseña incorrectos");
    }

    const authResponse: AuthResponse = {
      success: true,
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
    };

    return simulateApiCall(authResponse);
  },

  async validateToken(token: string): Promise<ApiResponse<boolean>> {
    if (token.startsWith("mock-token-")) {
      return simulateApiCall(true);
    }
    return simulateApiError("Token inválido");
  },

  async refreshToken(token: string): Promise<ApiResponse<AuthResponse>> {
    const userId = token.split("-")[2];
    const user = mockUsers.find((u) => u.id === parseInt(userId));

    if (!user) {
      return simulateApiError("Token inválido");
    }

    const authResponse: AuthResponse = {
      success: true,
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
    };

    return simulateApiCall(authResponse);
  },
};
