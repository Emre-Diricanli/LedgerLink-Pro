const API_URL = import.meta.env.VITE_LedgerLinkPro_Server_API;
import { http_context } from './http-context.js';

export const get_user_info = async () => {
    try {
        const response = await http_context(`${API_URL}/get-my-info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        //get and store data in local storage
        const data = await response.json();
        

       
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const fetch_users = async (pageSize, pageIndex, userType, activeStatus) => {
    try {
        // Construct query string
        const queryParams = new URLSearchParams({
            pageSize,
            pageIndex,
            userType,
            activeStatus
        }).toString();

        const url = `${API_URL}/user/admin/get-users?${queryParams}`;

        const response = await http_context(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export const validate_username = async (username) => {
    try {
        const response = await http_context(`${API_URL}/user/validate-username?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        //if username is valid
        if (data.valid) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}

export const validate_email = async (email) => {
    try {
        const response = await http_context(`${API_URL}/user/validate-email?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        //if email is valid
        if (data.valid) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}

export const admin_create_new_user = async (user) => {
    try {
        const response = await http_context(`${API_URL}/user/admin/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            return false;
        }

       return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}
