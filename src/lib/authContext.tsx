'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from './api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'staff';
  avatar?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('kpn_admin_token');
      const storedUser = localStorage.getItem('kpn_admin_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token validity with backend
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('kpn_admin_user', JSON.stringify(res.user));
          }
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  // Protected route guard
  useEffect(() => {
    if (!isLoading && pathname?.startsWith('/admin') && pathname !== '/admin/login') {
      if (!token) {
        router.push('/admin/login');
      }
    }
  }, [isLoading, token, pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kpn_admin_token', res.token);
        localStorage.setItem('kpn_admin_user', JSON.stringify(res.user));
        router.push('/admin');
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kpn_admin_token');
    localStorage.removeItem('kpn_admin_user');
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
