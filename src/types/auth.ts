// Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    theme: string;
    numberSystem: string;
  };
  accountType: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
  requiresEmailVerification?: boolean;
}

export interface AuthContextType {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: (allDevices?: boolean) => Promise<void>;
  refreshToken: () => Promise<void>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<{ message: string; user: User }>;
  resendVerification: (email: string) => Promise<{ message: string }>;
  
  // Password reset
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ message: string }>;
  
  // OTP Login
  requestOTP: (email: string) => Promise<{ message: string }>;
  loginWithOTP: (email: string, otp: string, rememberMe?: boolean) => Promise<AuthResponse>;
  
  // Magic Link Login & Signup
  requestMagicLink: (email: string) => Promise<{ message: string }>;
  signupWithMagicLink: (email: string, firstName: string, lastName: string) => Promise<{ message: string }>;
  loginWithMagicLink: (token: string, rememberMe?: boolean) => Promise<AuthResponse>;
  
  // Utility
  clearError: () => void;
  error: string | null;
}
