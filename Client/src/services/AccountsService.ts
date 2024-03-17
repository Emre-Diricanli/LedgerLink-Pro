import { Account, AccountSearchQuery, NewAccount } from "../components/interfaces/Accounts";

//used to sign in the user. returns the user object if successful, else returns null.
export const CreateNewAccount = async (newAccount : NewAccount, apiUrl : String): Promise<Account | null> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/create-new-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(newAccount),
        });

        if (!response.ok) {
            // Throw an error with the status code for non-2xx responses
            return null;
        }

        const data = await response.json();
        return data as Account;
    } catch (error) {
        console.error("Error in User Signin: ", (error as Error).message);
        return null; // Return null in case of error
    }
};

export const FetchAccounts = async (query: AccountSearchQuery, apiUrl: string): Promise<Account[]> => {
    try {
        const queryParams = new URLSearchParams({
            pageSize: query.pageSize.toString(),
            pageIndex: query.pageIndex.toString(),
            activeStatus: query.activeStatus.toString(),
            searchString: query.searchString
        });

        const url = `${apiUrl}/accounts/get-accounts?${queryParams}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return [] as unknown as Account[];
        }

        const data = await response.json();

        const accounts = data as Account[];

        return accounts;
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }

};

export const DeactivateAccounts = async (accountIds: string[], apiUrl: string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/deactivate-accounts`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(accountIds),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in Deactivate Accounts: ", (error as Error).message);
        return false; // Return false in case of error
    }
};

export const ActivateAccounts = async (accountIds: string[], apiUrl: string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/activate-accounts`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(accountIds),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in Activate Accounts: ", (error as Error).message);
        return false; // Return false in case of error
    }
};

export const DeleteAccounts = async (accountIds: string[], apiUrl: string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/delete-accounts`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(accountIds),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in Delete Accounts: ", (error as Error).message);
        return false; // Return false in case of error
    }
};

export const UpdateAccount = async (account: Account, apiUrl: string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/update-account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(account),
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in Update Account: ", (error as Error).message);
        return false; // Return false in case of error
    }
};