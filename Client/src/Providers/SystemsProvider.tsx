import React, { createContext, useContext, ReactNode } from 'react';
import { CheckOnlineStatus } from '../services/AuthService';

interface SystemsContextType {
    checkServerStatus: () => Promise<boolean>;
    apiUrl: string;
    publicPaths: string[];
}

const SystemsContext = createContext<SystemsContextType | undefined>(undefined);

export const useSystems = (): SystemsContextType => {
    const context = useContext(SystemsContext);
    if (context === undefined) {
        throw new Error('useSystems must be used within a SystemsProvider');
    }
    return context;
};

interface SystemsProviderProps {
    children: ReactNode;
    apiUrl: string; // Add prop for apiUrl
  }

export const SystemsProvider = ({ children, apiUrl }: SystemsProviderProps) => {
        let currentAPIUrl = apiUrl;
        const publicPaths = ['/user-signin', '/admin-signin', '/admin-signup', '/user-registration', '/server-offline', '/admin-confirm-email', './new-user/reset-password'];


        const checkServerStatus = async (): Promise<boolean> => {
                const status = await CheckOnlineStatus(apiUrl);

                return status;
        };

    return (
        <SystemsContext.Provider 
                value={{ 
                        checkServerStatus,
                        apiUrl: currentAPIUrl,
                        publicPaths: publicPaths
                }}
        >
                {children}
        </SystemsContext.Provider>
    );
};