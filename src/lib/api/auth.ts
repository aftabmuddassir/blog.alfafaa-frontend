import { apiClient, setAccessToken } from "./client";
import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/types";

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    const { user, tokens } = response.data.data;
    setAccessToken(tokens.access_token);
    return response.data.data;
  },

  // Login with email/password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    const { user, tokens } = response.data.data;
    setAccessToken(tokens.access_token);
    return response.data.data;
  },

  // Google OAuth login
  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/google",
      { id_token: idToken }
    );
    const { user, tokens } = response.data.data;
    setAccessToken(tokens.access_token);
    return response.data.data;
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ access_token: string }> => {
    const response = await apiClient.post<
      ApiResponse<{ access_token: string }>
    >("/auth/refresh-token");
    const { access_token } = response.data.data;
    setAccessToken(access_token);
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      setAccessToken(null);
    }
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.post("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};
