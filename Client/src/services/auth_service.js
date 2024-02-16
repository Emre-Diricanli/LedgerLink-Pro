const API_URL = import.meta.env.VITE_LedgerLinkPro_Server_API;
import { http_context } from './http-context.js';

export const check_auth = async () => {
    try {
        const response = await http_context(`${API_URL}/auth/check-auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            localStorage.setItem('isLoggedIn', false);
            return false;
        }
        var data = await response.json();
        var role = data.role;

        //store in local storage
        localStorage.setItem('role', role);
        localStorage.setItem('isLoggedIn', true);

        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

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


        //check if response was 428, if so redirect to new user new password page
        if (response.ok) {
            // Get encoded token from response
            const data = await response.json();
            const userNeedsPasswordReset = data.userNeedsPasswordReset;

            // If status is 428, redirect to new user reset password page
            if (userNeedsPasswordReset === false) {
                console.log('Request Was Successful and user does not need to reset password');
                return true;
            };
            console.log('Request Was Successful and user needs to reset password');

            const token = data.token;
            const id = data.id;

            // Store token in local storage
            localStorage.setItem('ps-reset-tk', token);

            // Return data with code and id
            return { code: 428, id: id };
        }

        if (!response.ok) {
if (response.status === 403) {
                const data = await response.json();
                const errorMsg = data.message;
                return { code: response.status, errorMsg };
            }
            return false;
        }
       

        //return role
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const admin_signin_service = async (email, password) => {
    try {
        const response = await http_context(`${API_URL}/auth/admin/login`, {
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
        // const data = await response.json();
        // const role = data.role;

        // //store in local storage
        // localStorage.setItem('role', role);

        //return role
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const admin_signup_service = async (email, password, firstName, lastName) => {
    try {
        const body = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        };
        console.log(body);
        const response = await http_context(`${API_URL}/auth/admin/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        // //check if response was 428, if so redirect to new user new password page
        // if (response.ok) {
        //    return true
        // }

        if (!response.ok) {
            return false;
        }
       
        //return role
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};


export const user_signup_service = async (email, firstName, lastName, dob, streetAddress, city, state, zipcode, apptnumber) => {
    try {
        const response = await http_context(`${API_URL}/auth/user/request-access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, firstName, lastName, dob, streetAddress, city, state, zipcode, apptnumber })
        });
        if (!response.ok) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const confirm_user_access = async (email) => {
    try {
        const response = await http_context(`${API_URL}/auth/confirm-user-access?email=${email}`, {
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

export const new_user_reset_password = async (newPassword, userid) => {
    try {
        const token = localStorage.getItem('ps-reset-tk');

        //encode token
        const encodedToken = encodeURIComponent(token);

        const requestBody = {
            token: encodedToken,
            newPassword: newPassword,
            userid: userid
        };

        const response = await http_context(`${API_URL}/auth/new-user/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        //if response is equal to 409, password was previously used
        if (response.status === 409) {
            return 409;
        }

        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export const check_online_status = async () => {
    try {
        const response = await http_context(`${API_URL}/auth/online-status`, {
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
}

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
    try {
        const response = await http_context(`${API_URL}/auth/role`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
        if (!response.ok) {
            localStorage.setItem('isLoggedIn', false);
            return false;
        }

        //grab role from response
        const data = await response.json();
        console.log('Data:', data);
        const role = data.role;

        console.log('Role:', role);

        //store in local storage
        localStorage.setItem('role', role);

        //switch statement to return auth level
        switch (role) {
            case 1:
                return "User";
            case 2:
                return "Manager";
            case 3:
                return "Admin";
            default:
                return "User";
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
    
};


export const admin_unlock_account = async (userId) => {  
    try {
        const response = await http_context(`${API_URL}/auth/admin/unlock-account?userId=${userId}`, {
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
        return false;
    }
}