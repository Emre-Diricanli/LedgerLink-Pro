import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { CheckOnlineStatus } from '../services/AuthService';

interface SystemsContextType {
    ServerHearbeat: () => Promise<boolean>;
    apiUrl: string;
    serverOnline: boolean;
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
        const [serverOnline, setServerOnline] = React.useState(false);
        const publicPaths = ['/user-signin', '/admin-signin', '/admin-signup', '/user-registration', '/server-offline', '/admin-confirm-email', './new-user/reset-password'];

        const HandleServerHearbeat = async (): Promise<boolean> => {
            const status = await CheckOnlineStatus(apiUrl);
            
            return status;
        };

        //if server is offline then redirect to server-offline page
        useEffect(() => {
           const checkStatus = async () => {
                const response = await HandleServerHearbeat();
            
                if (!response) {
                    setServerOnline(false);
                    window.location.href = '/server-offline';
                } else {
                    setServerOnline(true);
                }
            };

            checkStatus();
        }, []);
        

    return (
        <SystemsContext.Provider 
                value={{ 
                        ServerHearbeat : HandleServerHearbeat,
                        apiUrl: currentAPIUrl,
                        serverOnline: serverOnline,
                        publicPaths: publicPaths
                }}
        >
                {children}
        </SystemsContext.Provider>
    );
};