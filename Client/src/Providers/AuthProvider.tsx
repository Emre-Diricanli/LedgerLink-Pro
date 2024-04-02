import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CheckAuth, HandleAdminSignin, HandleUserSignin, HandleAdminSignup, HandleUserRequestAccess, HandleConfirmEmail, HandleResendConfirmationEmail, HandleConfirmUserAccess, HandleNewUserResetPassword, GetAuthLevel } from '../services/AuthService';
import { HandleUserSignout } from '../services/AuthService';
import { UserSignupRequest } from '../components/interfaces/Users';
import { useSystems } from './SystemsProvider';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  calling: boolean;
  fetchAuthentication: () => Promise<void>;
  HandleAdminSignin: (username: string, password: string) => Promise<boolean>;
  HandleUserSignin: (username: string, password: string) => Promise<boolean>;
  HandleAdminSignup: (username: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  HandleUserSignup: (newUser: UserSignupRequest ) => Promise<boolean>;
  HandleConfirmEmail : (email: string, token: string) => Promise<boolean>;
  HandleResendConfirmationEmail : (email: string) => Promise<boolean>;
  HandleConfirmUserAccess : (email: string) => Promise<boolean>;
  HandleNewUserResetPassword : (newPassword: string, id: string) => Promise<any>;
  HandleGetRole : () => Promise<any>;
  
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

interface AuthProviderProps {
  children: ReactNode;
  apiUrl: string; // Add prop for apiUrl
}

export const AuthProvider = ({ children, apiUrl }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(false);
  const systems = useSystems();
  const [calling, setCalling] = useState<boolean>(false);

  const fetchAuthentication = async () => {
    try{
      setCalling(true);
      //check page location. If either signin page or sigunp page, then return
      const paths = systems.publicPaths;
      const currentPath = window.location.pathname;
  
      if (paths.includes(currentPath)){
        return;
      }
  
      const response = await CheckAuth(apiUrl);
      setIsAuthenticated(response !== false);
  
      //if response is false, then redirect to signin page
      if (response === false) {
        window.location.href = '/user-signin';
      }
  
      //if response is not false, then grab role from storage
      if (response !== false) {
        let role = localStorage.getItem('role');
        if (role === '3') {
          setIsAdmin(true);
        } else if (role === '2') {
          setIsManager(true);
        } else {
          setIsAdmin(false);
          setIsManager(false);
        }
      }
    }
    catch{
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsManager(false);
    }
    finally{
      setCalling(false);
    }
  };

  const AdminSignin = async (username: String, password: String): Promise<boolean> => {
    const signinResult = await HandleAdminSignin(username, password, apiUrl);
    return signinResult;
  };

  const UserSignin = async (username: String, password: String): Promise<boolean> => {
    const signinResult = await HandleUserSignin(username, password, apiUrl);


    //if they do not need a password reset, then return true
    if (signinResult.resultSuccess === true){
        if (signinResult.userNeedsPasswordReset === false) {
          return true;
        }
        else{
            //if they do need a password reset, then handle
            const token = signinResult.token;
            const id = signinResult.id;

            localStorage.setItem('ps-reset-tk', token as string);

            //redirect to reset password page
            window.location.href = `/new-user/reset-password?id=${id}`;

            console.log('Redirecting to reset password page');
            return false;
        }
    }
    else if (signinResult.code === 403){
      //user is deactivated
      alert('Your account has been deactivated. Please contact your administrator to reactivate your account.')
      return false;
    }
    else{
      //likely a mismatched username and password
      return false;
    }
  };

  const AdminSignup = async (email: string, password: string, firstName: string, lastName : string): Promise<boolean> => {
    const signupResult = await HandleAdminSignup(email, password, firstName, lastName, apiUrl);

    return signupResult;
  };

  const UserSignup = async (newUser : UserSignupRequest): Promise<boolean> => {
    const signupResult = await HandleUserRequestAccess(newUser, apiUrl);
    return signupResult;
  };

  const ConfirmEmail = async (email: string, token: string): Promise<boolean> => {
    const confirmEmailResponse = await HandleConfirmEmail(email, token, apiUrl);

    return confirmEmailResponse;
  };

  const ResendConfirmationEmail = async (email: string): Promise<boolean> => {
    const resendEmailResponse = await HandleResendConfirmationEmail(email, apiUrl);

    return resendEmailResponse;
  };

  const ConfirmUserAccess = async (email : string): Promise<boolean> => {
    const response = await HandleConfirmUserAccess(email, apiUrl);
    return response;
  };

  const NewUserRestPassword = async (newPassword: string, id : string): Promise<any> => {
    const response = await HandleNewUserResetPassword(newPassword, id, apiUrl);

    if (response === 409){
      return 409;
    }
    else{
      return response;
    }
  };

  const GetRole = async () : Promise<any> => {
    const response = await GetAuthLevel(apiUrl);

    return response;
  }




  const signOut = async () => {
    console.log('Signing out');
    const response = await HandleUserSignout(apiUrl);
    if (response !== false) {

      // Assuming the signout service clears the authentication token. Server removes cookie
      setIsAuthenticated(false);

      // Redirect or perform additional cleanup after signout
      window.location.href = '/user-signin';
    }
  };

  useEffect(() => {
    fetchAuthentication();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isAdmin, 
        isManager,
        calling : calling,
        fetchAuthentication, 
        signOut,
        HandleAdminSignin: AdminSignin,
        HandleUserSignin: UserSignin,
        HandleAdminSignup: AdminSignup,
        HandleUserSignup: UserSignup,
        HandleConfirmEmail: ConfirmEmail,
        HandleResendConfirmationEmail: ResendConfirmationEmail,
        HandleConfirmUserAccess: ConfirmUserAccess,
        HandleNewUserResetPassword: NewUserRestPassword,
        HandleGetRole: GetRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
