import { Account, AccountLogs, AccountSearchQuery, AccountTransaction, JournalEntryLineDTO, NewAccount, RejectedJournalEntry, UnapprovedJournalEntry as UnapprovedJournalEntry } from "../components/interfaces/Accounts";

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

export const FetchAccountTransactions = async (accountId: string, apiUrl: string): Promise<AccountTransaction[]> => {
    try{
        const response = await fetch(`${apiUrl}/accounts/get-account-transactions/approved?accountId=${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return [] as unknown as AccountTransaction[];
        }

        const data = await response.json();

        const transactions = data as AccountTransaction[];

        return transactions;
    }
    catch (error) {
        console.error("Error in Fetch Account Transactions: ", (error as Error).message);
        return [] as unknown as AccountTransaction[];
    }
}

export const CreateNewAccountTransaction = async (transaction: AccountTransaction, apiUrl: string): Promise<AccountTransaction> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/create-new-account-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(transaction),
        });

        if (!response.ok) {
            return {} as AccountTransaction;
        }

        const data = await response.json();

        const newTransaction = data as AccountTransaction;

        return newTransaction;
    } catch (error) {
        console.error("Error in Create New Account Transaction: ", (error as Error).message);
        return {} as AccountTransaction; // Return empty object in case of error
    }
}

export const FetchAccountLogs = async (accountId: string, apiUrl: string): Promise<AccountLogs[]> => {
    try{
        const response = await fetch(`${apiUrl}/accounts/get-account-logs?accountId=${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return [] as unknown as AccountLogs[];
        }

        const data = await response.json();

        const logs = data as AccountLogs[];

        return logs;
    }
    catch (error) {
        console.error("Error in Fetch Account Logs: ", (error as Error).message);
        return [] as unknown as AccountLogs[];
    }
}

export const RejectJournalEntry = async (transactionId: string, rejectionReason: string, apiUrl: string): Promise<boolean> => {
    if (!transactionId || typeof transactionId !== 'string') {
        console.error('Invalid or missing transactionId');
        return false;
    }

    if (!rejectionReason || typeof rejectionReason !== 'string') {
        console.error('Invalid or missing rejectionReason');
        return false;
    }

    const params = new URLSearchParams({ transactionId, rejectionReason });

    try {
        const response = await fetch(`${apiUrl}/accounts/reject-transaction?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            return false;
        }

        return true;
    }
    catch (error) {
        console.error("Error in Send Account Rejection: ", (error as Error).message);
        return false;
    }
};

export const ApproveJournalEntry = async (transactionId: string, apiUrl: string): Promise<boolean> => {
    if (!transactionId || typeof transactionId !== 'string') {
        console.error('Invalid or missing transactionId');
        return false;
    }

    const params = new URLSearchParams({ transactionId });

    try {
        const response = await fetch(`${apiUrl}/accounts/approve-transaction?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            return false;
        }

        return true;
    }
    catch (error) {
        console.error("Error in Send Account Approval: ", (error as Error).message);
        return false;
    }
}

export const FetchUnapprovedTransactions = async ( accountId: String, apiUrl: string): Promise<UnapprovedJournalEntry[]> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/get-account-transactions/unapproved?accountId=${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return [] as unknown as UnapprovedJournalEntry[];
        }

        const data = await response.json();

        const transactions = data as UnapprovedJournalEntry[];

        return transactions;

    } catch (error) {
        console.error("Error in Fetch Unapproved Transactions: ", (error as Error).message);
        return [] as unknown as UnapprovedJournalEntry[];
    }

};

export const PostNewJournalEntry = async (accountId: string, entryName: string, journalEntryLines: JournalEntryLineDTO[], apiUrl: string): Promise<UnapprovedJournalEntry> => {
    try {
        const body = {
            accountId,
            entryName,
            journalEntryLines
        };
        const response = await fetch(`${apiUrl}/accounts/create-new-unapproved-journal-entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        if (!response.ok) {
            return {} as UnapprovedJournalEntry;
        }

        const data = await response.json();

        const newJournalEntry = data as UnapprovedJournalEntry;

        return newJournalEntry;
    } catch (error) {
        console.error("Error in Post New Unapproved Transaction: ", (error as Error).message);

        return {} as UnapprovedJournalEntry;
    }
};

export const GetRejectedJournalEntries = async (accountId: string, apiUrl: string): Promise<RejectedJournalEntry[]> => {
    try {
        const response = await fetch(`${apiUrl}/accounts/rejected-transactions?accountId=${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return [] as unknown as RejectedJournalEntry[];
        }

        const data = await response.json();

        const transactions = data as RejectedJournalEntry[];

        return transactions;
    } catch (error) {
        console.error("Error in Get Rejected Journal Entries: ", (error as Error).message);
        return [] as unknown as RejectedJournalEntry[];
    }
}