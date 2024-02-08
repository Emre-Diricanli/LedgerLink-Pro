const API_URL = import.meta.env.VITE_LedgerLinkPro_Server_API;
import { http_context } from './http-context.js';

export const user_signin_service = async (email, password) => {
    try {
        const response = await http_context(`${API_URL}/auth/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            return false;
        }

        //grab role from response
        const data = await response.json();
        const role = data.role;

        //store in local storage
        localStorage.setItem('role', role);

        //return role
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const user_signout_service = async () => {
    try {
        const response = await http_context(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const remove_user_info = async () => {
    try {
        //Remove user role token
        localStorage.removeItem('role');


        return;
    }catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};


export const confirm_email = async (email, token) => {
    try {
        const encodedToken = encodeURIComponent(token);
        const requestBody = {
            email: email,
            token: encodedToken
        };

        const response = await http_context(`${API_URL}/auth/confirm-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const resend_confirmation_email = async (email) => {
    try {


        const response = await http_context(`${API_URL}/auth/resend-confirmation-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};


export const test_auth = async () => {
    try {
        const response = await http_context(`${API_URL}/dev/dev-test-auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const get_auth_level = async () => {
    var encodedRole = localStorage.getItem('role');
    const decodedRole = atob(encodedRole);

    //switch statement to return auth level
    switch (decodedRole) {
        case 'user':
            return 1;
        case 'Manager':
            return 2;
        case 'Admin':
            return 3;
        default:
        try {
            const response = await http_context(`${API_URL}/auth/role`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });
            if (!response.ok) {
                return false;
            }
    
            //grab role from response
            const data = await response.json();
            const role = data.role;
    
            //store in local storage
            localStorage.setItem('role', role);

            //decode role
            var encodedRole = localStorage.getItem('role');
            const decodedRole = atob(encodedRole);

            //switch statement to return auth level
            switch (decodedRole) {
                case 'user':
                    return 1;
                case 'Manager':
                    return 2;
                case 'Admin':
                    return 3;
                default:
                    return 0;
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
};
