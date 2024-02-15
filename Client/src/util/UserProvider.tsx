import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../components/interfaces/user-management';
import { get_my_info } from '../services/user_info_service';
import { check_auth } from '../services/auth_service';

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  

  const fetchUser = async () => {
    if (!isAuthenticated) {
      return;
    }
    const userData: User = await get_my_info();
    setUser(userData);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await check_auth();

      if (response === false) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }

    checkAuthentication();
    
  }, []);
  

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, fetchUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};