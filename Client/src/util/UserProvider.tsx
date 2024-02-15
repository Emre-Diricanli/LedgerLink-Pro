import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../components/interfaces/user-management';
import { get_my_info } from '../services/user_info_service';

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
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

  const fetchUser = async () => {
    // Simulate fetching user data
    const userData: User = await get_my_info(); // Adjust to match your API call
    setUser(userData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
