const API_URL = import.meta.env.VITE_ClubCore_Server_API;
import { http_context } from './http-context.js';

export const signin_service = async (email, password) => {
    try {
        const response = await http_context(`${API_URL}/login?useCookies=true`, {
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
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};
