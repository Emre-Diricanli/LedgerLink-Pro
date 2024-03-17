import { createContext, useContext, useState, ReactNode } from "react";
import { Account, AccountSearchQuery, NewAccount } from "../components/interfaces/Accounts";
import { ActivateAccounts, CreateNewAccount, DeactivateAccounts, DeleteAccounts, FetchAccounts, UpdateAccount } from "../services/AccountsService";

type AccountsContextType = {
    isLoading: boolean;
    accounts: Account[];
    fetchAccounts: (pageSize: number, pageIndex: number, activeStatus: number, searchString: string, returnAccounts: boolean) => Promise<boolean | Account[]>;
    replaceAccount: (updatedAccount: Account[]) => void;
    createNewAccount: (newAccount: NewAccount) => Promise<boolean>;
    deleteAccounts: (accountIds: string[]) => Promise<boolean>; // Fix typo here
    updateAccount: (account: Account) => Promise<boolean>;
    activateAccounts: (accountIds: string[]) => Promise<boolean>;
    deactivateAccounts: (accountIds: string[]) => Promise<boolean>;
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
    apiUrl: string;
}

export default function AccountsProvider({ children, apiUrl }: AccountProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const HandleFetchAccounts = async (pageSize: number, pageIndex: number, activeStatus: number, searchString: string, returnAccounts: boolean):  Promise<boolean | Account[]> => {
        const queryParameters: AccountSearchQuery = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            activeStatus: activeStatus,
            searchString: searchString
          };
      
          const usersResponse = await FetchAccounts(queryParameters, apiUrl);

          // If returnAccounts is true, return the accounts otherwise set the accounts and loading state and return true
          if (returnAccounts){
            return usersResponse;
          } else {
            if (usersResponse === null) {
                return false;
            }
            setAccounts(usersResponse);
            setIsLoading(false);
            return true;
          }
    };

    const addAccount = (newAccount: Account) => {
        setAccounts([...accounts, newAccount]);
    };

    const HandleReplaceAccount = async (updatedAccount: Account[]) => {
        const tempAccounts = accounts;
        //foreach account, find in the list and update
        updatedAccount.forEach(account => {
            const index = accounts.findIndex(a => a.accountId === account.accountId);
            if (index > -1) {
                accounts[index] = account;
            }
        });

        console.log('Accounts Have Been Updated:', accounts);
        console.log('Temp Accounts:', tempAccounts);
    };

    const HandleCreateNewAccount = async (newAccount: NewAccount): Promise<boolean> => {
        const response = await CreateNewAccount(newAccount, apiUrl);

        if (response === null) {
            return false;
        }

        addAccount(response);

        return true;
    };

    const HandleDeleteAccounts = async (accountIds: string[]): Promise<boolean> => {
        const response = await DeleteAccounts(accountIds, apiUrl);

        return response;
    }

    const HandleUpdateAccount = async (account: Account): Promise<boolean> => {
        const response = await UpdateAccount(account, apiUrl);

        return response;
    }

    const HandleActivateAccounts = async (accountIds: string[]): Promise<boolean> => {
        const response = await ActivateAccounts(accountIds, apiUrl);

        return response;
    }

    const HandleDeactivateAccounts = async (accountIds: string[]): Promise<boolean> => {
        const response = await DeactivateAccounts(accountIds, apiUrl);

        return response;
    }

    return (
        <AccountsContext.Provider value={{ 
            isLoading: isLoading, 
            accounts, 
            fetchAccounts: HandleFetchAccounts,
            replaceAccount: HandleReplaceAccount,
            createNewAccount : HandleCreateNewAccount,
            deleteAccounts: HandleDeleteAccounts,
            updateAccount: HandleUpdateAccount,
            activateAccounts: HandleActivateAccounts,
            deactivateAccounts: HandleDeactivateAccounts
        }}>
            {children}
        </AccountsContext.Provider>
    );
}


