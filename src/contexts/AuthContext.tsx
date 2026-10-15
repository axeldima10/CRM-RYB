import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Profile, UserRole } from '../types/database';
import { demoProfiles } from '../data/demo';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = useCallback(async (_email: string, _password?: string) => {
    setIsLoading(true);
    // Demo mode: match by email or default to admin
    const found = demoProfiles.find((p) => p.email === _email);
    await new Promise((r) => setTimeout(r, 500));
    setUser(found || demoProfiles[0]);
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (_email: string, _password: string, fullName: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser({
      id: `new-${Date.now()}`,
      email: _email,
      full_name: fullName,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchDemoUser = useCallback((role: UserRole) => {
    const found = demoProfiles.find((p) => p.role === role);
    if (found) setUser(found);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, switchDemoUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
