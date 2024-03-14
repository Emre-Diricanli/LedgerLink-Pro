import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewUser, User, UserSearchQuery } from '../components/interfaces/Users';
import { AdminCreateNewUser, AdminDeleteUser, FetchUsers, GetMyInfo } from '../services/UserService';
import { useAuth } from './AuthProvider';

interface UserContextType {
  user: User | null;
  FetchUser: () => Promise<void>;
  FetchUsers: (pageSize: number, pageIndex: number, userType: number, activeStatus: number, searchString: string) => Promise<User[]>;
  CreateNewUser : (newUser: NewUser) => Promise<boolean>;
  DeleteUser : (userId: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
  apiUrl: string; // Add prop for apiUrl
}

export const UserProvider = ({ children, apiUrl }: UserProviderProps) => {
  const [hasUserInfo, setHasUserInfo] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { calling } = useAuth();

  useEffect(() => {
    if (!calling){
      if (!hasUserInfo){
        HandleFetchUser();
        setHasUserInfo(true);
      }
    }
  }, [calling]);
  

  //Get current user
  const HandleFetchUser = async () => {
    const userData = await GetMyInfo(apiUrl);

    if (userData != null){
      if (userData === false){
        setUser(null);
        return;
      }
      else {
        setUser(userData);
        return;
      }
    }
  };

  //Fetch users based on parameters
  const HandleFetchUsers = async (pageSize: number, pageIndex: number, userType: number, activeStatus: number, searchString: string):  Promise<User[]> => {
    // Remove unused variable
    const queryParameters: UserSearchQuery = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      userType: userType.toString(), // Update type to string
      activeStatus: activeStatus,
      searchString: searchString
    };

    const usersResponse = await FetchUsers(queryParameters, apiUrl);

    return usersResponse;
  };

  //Create new user
  const HandleAdminCreateNewUser = async (newUser: NewUser) : Promise<boolean> => {
    const createNewUserResponse = await AdminCreateNewUser(newUser, apiUrl);

    return createNewUserResponse;
  };

  //Delete user
  const HandleAdminDeleteUser = async (userId: string) : Promise<boolean> => {
    const deleteUserResponse = await AdminDeleteUser(userId, apiUrl);

    return deleteUserResponse;
  };


  return (
    <UserContext.Provider value={{ 
      user, 
    FetchUser: HandleFetchUser,
    FetchUsers : HandleFetchUsers,
    CreateNewUser : HandleAdminCreateNewUser,
    DeleteUser : HandleAdminDeleteUser
    }}>
      {children}
    </UserContext.Provider>
  );
};