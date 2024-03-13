import React, { createContext, useContext, ReactNode } from 'react';
import { CheckOnlineStatus } from '../services/AuthService';

interface SystemsContextType {
    checkServerStatus: () => Promise<boolean>;
}

const SystemsContext = createContext<SystemsContextType | undefined>(undefined);

export const useSystems = (): SystemsContextType => {
    const context = useContext(SystemsContext);
    if (context === undefined) {
        throw new Error('useSystems must be used within a SystemsProvider');
    }
    return context;
};

export const SystemsProvider = ({ children }: { children: ReactNode }) => {
        const apiUrl = "http://localhost:7071/api/v1";


        const checkServerStatus = async (): Promise<boolean> => {
                const status = await CheckOnlineStatus(apiUrl);

                return status;
        };

    return (
        <SystemsContext.Provider 
                value={{ 
                        checkServerStatus,
                }}
        >
                {children}
        </SystemsContext.Provider>
    );
};