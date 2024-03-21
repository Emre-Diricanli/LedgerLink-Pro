import { User } from "../interfaces/Users";

// Define the UserAction type for better type checking
export type UserAction = 'Activate' | 'Deactivate' | 'Delete';

// Action handling functions
export const ActivateUsers = async (userIds: string[], apiUrl : string): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${apiUrl}/user/admin/activate-multiple-users`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    //execute the activation and return true or false based on the response
    return response.ok;
    
};

export const DeactivateUsers = async (userIds: string[], apiUrl : string): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${apiUrl}/user/admin/deactivate-multiple-users`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    //execute the deactivation and return true or false based on the response
    return response.ok;
    
};

export const DeleteUsers = async (userIds: string[], apiUrl : string): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${apiUrl}/user/admin/delete-multiple-users`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    //execute the delete and return true or false based on the response
    return response.ok;
};

export const UpdateUser = async (user : User, apiUrl : string): Promise<boolean> => {

    const response = await fetch(`${apiUrl}/user/admin/update-user-information`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
    });

    //execute the update and return true or false based on the response
    return response.ok;
};

export const UnlockAccounts = async (userIds: string[], apiUrl : string): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${apiUrl}/user/admin/unlock-multiple-user-accounts`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    //execute the unlock account and return true or false based on the response
    return response.ok;
}

export const ResendConfirmationEmail = async (userIds: string[], apiUrl : string): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${apiUrl}/user/admin/resend-confirmation-email`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    //execute the resend confirmation email and return true or false based on the response
    return response.ok;
}