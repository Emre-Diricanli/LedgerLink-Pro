import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { CheckOnlineStatus } from '../services/AuthService';

interface HttpContextType {
    apiUrl: string;
    serverOnline: boolean;
    fetchWithAuth: (url: string, options: any) => Promise<Response>;
}

const HttpContext = createContext<HttpContextType | undefined>(undefined);

export const useHttp = (): HttpContextType => {
    const context = useContext(HttpContext);
    if (!context) {
        throw new Error('useHttp must be used within a HttpProvider');
    }
    return context;
};

interface HttpProviderProps {
    children: ReactNode;
    apiUrl: string;
}

export const HttpProvider = ({ children, apiUrl }: HttpProviderProps) => {
    const [serverOnline, setServerOnline] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const status = await CheckOnlineStatus(apiUrl);
            setServerOnline(status);
            if (!status) {
                window.location.href = '/server-offline';
            }
        };

        checkStatus();
        // Consider adding a mechanism to periodically check or listen for changes in server status
    }, [apiUrl]);

    const fetchWithAuth = async (url: string, options: any) => {
        if (!serverOnline) {
            console.log('Server is offline.');
            throw new Error('Server is offline');
        }

        try {
            const response = await fetch(`${apiUrl}${url}`, options);
            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };

    return (
        <HttpContext.Provider value={{ apiUrl, serverOnline, fetchWithAuth }}>
            {children}
        </HttpContext.Provider>
    );
};
