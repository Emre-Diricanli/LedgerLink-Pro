import { createContext, PropsWithChildren, useContext, useState, useEffect, ReactNode } from "react";
import { Account, NewAccount } from "../components/interfaces/Accounts";
import { CreateNewAccount } from "../services/AccountsService";

// Update your context type to include user and isAuthenticated
// Provide an initial context value that matches the AccountContextType
type AccountsContextType = {
    isLoading: boolean;
    accounts: Account[];
    createNewAccount: (newAccount: NewAccount) => Promise<boolean>;
};

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const useAccounts = (): AccountsContextType => {
    const context = useContext(AccountsContext);
    if (context === undefined) {
      throw new Error('useAccounts must be used within an AccountsProvider');
    }
    return context;
  };

interface AccountProviderProps {
    children: ReactNode;
    apiUrl: string; // Add prop for apiUrl
  }

export default function AccountsProvider({ children, apiUrl }: AccountProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const HandleCreateNewAccount = async (newAccount: NewAccount): Promise<boolean> => {
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

    return (
        <AccountsContext.Provider value={{ 
            isLoading: isLoading, 
            accounts, 
            createNewAccount : HandleCreateNewAccount 
        }}>
            {children}
        </AccountsContext.Provider>
    );
}


