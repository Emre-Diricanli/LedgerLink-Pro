import { useHttp } from "../Providers/HttpProvider";
import { UserSigninResult, UserSignupRequest } from "../components/interfaces/Users";


export const CheckAuth = async (apiUrl : String): Promise<Boolean> => {
    try {
        const response = await fetch(`${apiUrl}/auth/check-auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (!response.ok) {
            localStorage.setItem('isLoggedIn', 'false');
            return false;
        }
        var data = await response.json();
        var role = data.role;

        //store in local storage
        localStorage.setItem('role', role);
        localStorage.setItem('isLoggedIn', 'true');

        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const HandleUserSignin = async (email : String, password : String, apiUrl : String): Promise<UserSigninResult> => {
    try {
        const response = await fetch(`${apiUrl}/auth/user/login`, {
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
            const data = await response.json() as UserSigninResult;
            return data;
        } 
        else {
            return {
                resultSuccess: false,
                userNeedsPasswordReset: false,
                token: '',
                id: '',
                code: response.status
            };
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const HandleAdminSignin = async (email : String, password : String, apiUrl : String) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/auth/admin/login`, {
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

        //return role
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const HandleAdminSignup = async (email: string, password: string, firstName: string, lastName: string, apiUrl : String): Promise<boolean> => {
    try {
        const body = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        };


        console.log(body);
        const response = await fetch(`${apiUrl}/auth/admin/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

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


export const HandleUserRequestAccess = async (newUser: UserSignupRequest, apiUrl: string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/auth/user/request-access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newUser)
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

export const HandleConfirmUserAccess = async (email: string, apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/auth/confirm-user-access?email=${email}`, {
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

export const HandleUserSignout = async (apiUrl : string): Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/auth/logout`, {
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

export const HandleConfirmEmail = async (email: string, token: string, apiUrl : string) : Promise<boolean> => {
    try {
        const encodedToken = encodeURIComponent(token);
        const requestBody = {
            email: email,
            token: encodedToken
        };

        const response = await fetch(`${apiUrl}/auth/confirm-email`, {
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

export const HandleResendConfirmationEmail = async (email: string, apiUrl : string) : Promise<boolean> => {
    try {


        const response = await fetch(`${apiUrl}/auth/resend-confirmation-email`, {
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

export const HandleNewUserResetPassword = async (newPassword: string, userid: string, apiUrl: string) => {
    try {
        const token = localStorage.getItem('ps-reset-tk');

        // encode token if it exists
        const encodedToken = token ? encodeURIComponent(token) : null;

        // if token is null, return false
        if (encodedToken === null) {
            return false;
        }

        const requestBody = {
            token: encodedToken,
            newPassword: newPassword,
            userid: userid
        };

        const response = await fetch(`${apiUrl}/auth/new-user/reset-password`, {
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

export const CheckOnlineStatus = async (apiUrl: string) => {
    try {
        const response = await fetch(`${apiUrl}/auth/online-status`, {
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

export const GetAuthLevel = async (apiUrl : string) => {    
    try {
        const response = await fetch(`${apiUrl}/auth/role`, {
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