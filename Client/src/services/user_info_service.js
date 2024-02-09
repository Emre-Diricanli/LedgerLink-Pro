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
