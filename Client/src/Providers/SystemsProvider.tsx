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
    apiUrl: string;
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
            // Check if the current page is /server-offline
                const response = await HandleServerHearbeat();
            
                if (!response) {
                    setServerOnline(false);
                    
                    // Redirect to server-offline page, but first check if the current page is not server-offline
                    if (window.location.pathname !== '/server-offline') {
                        window.location.href = '/server-offline';
                    }

                } else {
                    if (serverOnline === false) {
                        setServerOnline(true);

                        //redirect to home page
                        if (window.location.pathname === '/server-offline') {
                            window.location.href = '/';
                        }
                    }
                }
            }

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