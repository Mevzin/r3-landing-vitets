import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import type { User } from '../types';



interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!hasCheckedAuth) {
      checkAuthStatus();
    }
  }, [hasCheckedAuth]);

  const checkAuthStatus = async () => {
    try {
      // Verificar se há tokens armazenados
      if (!authService.isAuthenticated()) {
        setUser(null);
        setIsLoading(false);
        setHasCheckedAuth(true);
        return;
      }

      const response = await authService.getCurrentUser();
      setUser(response);
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Se falhar ao verificar status, limpar tokens e usuário
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
      setHasCheckedAuth(true);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);

      const { user: userData } = response;
      setUser(userData);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};