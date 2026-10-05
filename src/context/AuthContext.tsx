import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isAdminAuthenticated: boolean;
  loginAdmin: (username: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AUTH_STORAGE_KEY = 'noir_vortex_admin_auth_v1';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'streetwear2026';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, isAdminAuthenticated ? 'true' : 'false');
    } catch (err) {
      console.error('Failed to save auth state:', err);
    }
  }, [isAdminAuthenticated]);

  const loginAdmin = useCallback((username: string, pass: string) => {
    const trimmedUser = username.trim();
    const trimmedPass = pass.trim();

    if (trimmedUser === ADMIN_USER && trimmedPass === ADMIN_PASS) {
      setIsAdminAuthenticated(true);
      setIsLoginModalOpen(false);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials. Use admin / streetwear2026' };
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
