import { createContext, PropsWithChildren, useContext, useState, useEffect, ReactNode } from "react";
import { Account } from "../components/interfaces/Accounts";
import { CreateNewAccount } from "../services/AccountsService";

// Update your context type to include user and isAuthenticated
// Provide an initial context value that matches the AuthContextType
type AccountsProviderProps = PropsWithChildren & {
    isLoading: boolean;
    accounts: Account[];
    createNewAccount: (newAccount: Account) => void;
};

const AccountsContext = createContext<AccountsProviderProps>({
    isLoading: true,
    accounts: [],
    createNewAccount: () => {},
});

export default function AccountsProvider({ children }: PropsWithChildren<{}>) {
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = "http://localhost:7071/api/v1";
    const [accounts, setAccounts] = useState<Account[]>([]);

    const createNewAccount = async (newAccount: Account): Promise<boolean> => {
        // Create the new account

        const response = await CreateNewAccount(newAccount, apiUrl);

        //null check 
        if (response === null) {
            return false;
        }

        //response is the new account. add it to the list of accounts
        addAccount(response);

        return true;
    };

    const addAccount = (newAccount: Account) => {
        setAccounts([...accounts, newAccount]);
    };

    if (isLoading) {
        return <div>Loading Calendar Provider...</div>; // Consider typing this as ReactNode for flexibility
    }

    return (
        <AccountsContext.Provider value={{ isLoading: isLoading, accounts, createNewAccount }}>
            {children}
        </AccountsContext.Provider>
    );
}

export const useAccounts = () => {
    const context = useContext(AccountsContext);
    
    if (context === undefined){
        throw new Error('useAccounts must be used within an AccountsProvider');
    }

    return context;
}
