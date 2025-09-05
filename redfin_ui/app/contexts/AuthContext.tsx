"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 초기 로드 시 저장된 토큰과 사용자 정보 복원
  useEffect(() => {
    if (!isClient) return;

    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        if (savedToken && savedUser) {
          const userData = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isClient]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    if (isClient) {
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (isClient) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (isClient) {
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
