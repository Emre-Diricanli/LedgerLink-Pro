import { Account } from "../components/interfaces/Accounts";

//used to sign in the user. returns the user object if successful, else returns null.
export const CreateNewAccount = async (newAccount : Account, apiUrl : String): Promise<Account | null> => {
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as Account;
    } catch (error) {
        console.error("Error in User Signin: ", (error as Error).message);
        return null; // Return null in case of error
    }
};