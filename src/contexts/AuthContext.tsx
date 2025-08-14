import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthTokens, LoginCredentials, RegisterCredentials, AuthResponse, AuthContextType } from '../types/auth';
import { AuthAPI, STORAGE_KEYS } from '../utils/authAPI';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);

        if (accessToken && refreshToken && userData) {
          setTokens({ accessToken, refreshToken });
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Utility functions
  const saveAuthData = (user: User, tokens: AuthTokens) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setUser(user);
    setTokens(tokens);
  };

  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setTokens(null);
  };

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    setError(message);
    throw error;
  };

  const clearError = () => setError(null);

  // Auth actions
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      clearError();
      const response = await AuthAPI.login(credentials);
      saveAuthData(response.user, response.tokens);
      return response;
    } catch (error) {
      handleError(error);
      throw error; // This will never execute due to handleError throwing
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      clearError();
      const response = await AuthAPI.register(credentials);
      saveAuthData(response.user, response.tokens);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (allDevices = false) => {
    try {
      if (tokens?.refreshToken) {
        if (allDevices) {
          await AuthAPI.logoutAll();
        } else {
          await AuthAPI.logout(tokens.refreshToken);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  const refreshToken = async () => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await AuthAPI.refreshToken(tokens.refreshToken);
      const newTokens = response.tokens;
      
      // Update tokens while preserving user data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
      setTokens(newTokens);
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      clearError();
      const response = await AuthAPI.verifyEmail(token);
      
      // Update user data if currently logged in
      if (user) {
        const updatedUser = { ...user, isEmailVerified: true };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
      
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      clearError();
      return await AuthAPI.resendVerification(email);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      clearError();
      return await AuthAPI.forgotPassword(email);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      clearError();
      const response = await AuthAPI.resetPassword(token, password);
      // Clear auth data since password reset invalidates all tokens
      clearAuthData();
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const requestOTP = async (email: string) => {
    try {
      clearError();
      return await AuthAPI.requestOTP(email);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const loginWithOTP = async (email: string, otp: string, rememberMe = false): Promise<AuthResponse> => {
    try {
      setLoading(true);
      clearError();
      const response = await AuthAPI.loginWithOTP(email, otp, rememberMe);
      saveAuthData(response.user, response.tokens);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestMagicLink = async (email: string) => {
    try {
      clearError();
      return await AuthAPI.requestMagicLink(email);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const signupWithMagicLink = async (email: string, firstName: string, lastName: string) => {
    try {
      clearError();
      return await AuthAPI.signupWithMagicLink(email, firstName, lastName);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const completeSignupWithMagicLink = async (token: string, password?: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      clearError();
      const response = await AuthAPI.completeSignupWithMagicLink(token, password);
      saveAuthData(response.user, response.tokens);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMagicLink = async (token: string, rememberMe = false): Promise<AuthResponse> => {
    try {
      setLoading(true);
      clearError();
      const response = await AuthAPI.loginWithMagicLink(token, rememberMe);
      saveAuthData(response.user, response.tokens);
      return response;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    requestOTP,
    loginWithOTP,
    requestMagicLink,
    signupWithMagicLink,
    completeSignupWithMagicLink,
    loginWithMagicLink,
    clearError,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
