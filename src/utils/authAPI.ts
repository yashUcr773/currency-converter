import type { AuthTokens, AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
} as const;

// API client with automatic token handling
export class AuthAPI {
  private static async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async logout(refreshToken: string): Promise<{ message: string }> {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  static async logoutAll(): Promise<{ message: string }> {
    return this.makeRequest('/auth/logout-all', {
      method: 'POST',
    });
  }

  static async refreshToken(refreshToken: string): Promise<{ tokens: AuthTokens }> {
    return this.makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  static async verifyEmail(token: string): Promise<{ message: string; user: User }> {
    return this.makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static async resendVerification(email: string): Promise<{ message: string }> {
    return this.makeRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  static async requestOTP(email: string): Promise<{ message: string }> {
    return this.makeRequest('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async loginWithOTP(email: string, otp: string, rememberMe = false): Promise<AuthResponse> {
    return this.makeRequest('/auth/login-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, rememberMe }),
    });
  }

  static async requestMagicLink(email: string): Promise<{ message: string }> {
    return this.makeRequest('/auth/request-magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async loginWithMagicLink(token: string, rememberMe = false): Promise<AuthResponse> {
    return this.makeRequest('/auth/magic-login', {
      method: 'POST',
      body: JSON.stringify({ token, rememberMe }),
    });
  }
}
