import { User } from "../interfaces/Users";

const API_URL = 'http://localhost:7070';

// Define the UserAction type for better type checking
export type UserAction = 'Activate' | 'Deactivate' | 'Delete';

// Action handling functions
export const activateUsers = async (userIds: string[]): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${API_URL}/user/admin/activate-multiple-users`, {
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

export const deactivateUsers = async (userIds: string[]): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${API_URL}/user/admin/deactivate-multiple-users`, {
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

export const deleteUsers = async (userIds: string[]): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${API_URL}/user/admin/delete-multiple-users`, {
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

export const updateUser = async (user : User): Promise<boolean> => {

    const response = await fetch(`${API_URL}/user/admin/update-user-information`, {
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

export const unlockAccounts = async (userIds: string[]): Promise<boolean> => {
    const body = {
        userIds,
    };

    const response = await fetch(`${API_URL}/user/admin/unlock-multiple-user-accounts`, {
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
