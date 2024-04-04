import { createContext, useContext, useState, ReactNode } from "react";
import { Account, AccountLogs, AccountSearchQuery, AccountTransaction, NewAccount, UnapprovedTransaction } from "../components/interfaces/Accounts";
import { ActivateAccounts, CreateNewAccount, CreateNewAccountTransaction, DeactivateAccounts, DeleteAccounts, FetchAccountLogs, FetchAccountTransactions, FetchAccounts, FetchUnapprovedTransactions, PostNewUnapprovedTransaction, UpdateAccount } from "../services/AccountsService";

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
    getAccountTransactions: (accountId: string) => Promise<AccountTransaction[]>;
    createAccountTransaction: (transaction: AccountTransaction) => Promise<AccountTransaction>;
    fetchAccountLogs: (accountId: string) => Promise<AccountLogs[]>;
    getUnapprovedTransactions: (accountId: string) => Promise<UnapprovedTransaction[]>;
    createUnapprovedTransaction: (accountId: string, value: number, description: string) => Promise<UnapprovedTransaction>;
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

    const HandleGetAccountTransactions = async (accountId: string): Promise<AccountTransaction[]> => {
        const response = await FetchAccountTransactions(accountId, apiUrl);

        return response;
    };

    const HandleCreateAcccountTransaction = async (transaction: AccountTransaction): Promise<AccountTransaction> => {
        const response = await CreateNewAccountTransaction(transaction, apiUrl);

        return response;
    }

    const HandleFetchAccountLogs = async (accountId: string): Promise<AccountLogs[]> => {
       const response  = await FetchAccountLogs(accountId, apiUrl);

         return response;
    } 

    const HandleFetchUnaprovedTransactions = async (accountId: string): Promise<UnapprovedTransaction[]> => {
        const response = await FetchUnapprovedTransactions(accountId, apiUrl);

        return response;
    }

    const HandleCreateUnapprovedTransaction = async (accountId: string, value: number, description: string): Promise<UnapprovedTransaction> => {
        // Call the create unapproved transaction function from the accounts provider
        const response = await PostNewUnapprovedTransaction(accountId,  description, value, apiUrl);

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
            deactivateAccounts: HandleDeactivateAccounts,
            getAccountTransactions: HandleGetAccountTransactions,
            createAccountTransaction: HandleCreateAcccountTransaction,
            fetchAccountLogs: HandleFetchAccountLogs,
            getUnapprovedTransactions: HandleFetchUnaprovedTransactions,
            createUnapprovedTransaction: HandleCreateUnapprovedTransaction
        }}>
            {children}
        </AccountsContext.Provider>
    );
}


