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
