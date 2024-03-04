import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { check_auth } from '../services/auth_service';
import { user_signout_service } from '../services/auth_service';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  fetchAuthentication: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchAuthentication = async () => {
    const response = await check_auth();
    setIsAuthenticated(response !== false);

    //if response is not false, then grab role from storage
    if (response !== false) {
      let role = localStorage.getItem('role');
      if (role === '3') {
        setIsAdmin(true);
      }
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    const response = await user_signout_service();
    if (response !== false) {
      // Assuming the signout service clears the authentication token
      setIsAuthenticated(false);
      // Redirect or perform additional cleanup after signout
      window.location.href = '/use-signin';
    }
  };

  useEffect(() => {
    fetchAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, fetchAuthentication, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
