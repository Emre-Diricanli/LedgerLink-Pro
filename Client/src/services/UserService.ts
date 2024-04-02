import { NewUser, SimpleUser, User, UserSearchQuery } from "../components/interfaces/Users";

export const GetMyInfo = async (apiUrl : string): Promise<User | false> => {
    try {
        const response = await fetch(`${apiUrl}/user/get-my-info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return false;
        };

        //get and store data in local storage
        const data = await response.json();

        return data;

        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

export const FetchUsers = async (searchQuery: UserSearchQuery, apiUrl : string) : Promise<User[]> => {
    try {
       // Construct query string
       const queryParams = new URLSearchParams({
            pageSize: searchQuery.pageSize.toString(),
            pageIndex: searchQuery.pageIndex.toString(), // Convert pageIndex to string
            userType: searchQuery.userType,
            activeStatus: searchQuery.activeStatus.toString(), // Convert activeStatus to string
            searchString: searchQuery.searchString
        }).toString();

        const url = `${apiUrl}/user/admin/get-users?${queryParams}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            //empty array
            return [] as unknown as User[];
        }

        const data = await response.json();

        const users = data as User[];
        return users;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export const ValidateUsername = async (username : string, apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/validate-username?username=${username}`, {
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

export const ValidateEmail = async (email : string, apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/validate-email?email=${email}`, {
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

export const AdminCreateNewUser = async (user : NewUser, apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/admin/create-user`, {
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

export const AdminDeleteUser = async (userId : string, apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/admin/delete-user?userId=${userId}`, {
            method: 'DELETE',
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

export const AdminDeactivateUser = async (userId : string,  apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/admin/deactivate-user?userId=${userId}`, {
            method: 'PUT',
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

export const AdminActivateUser = async (userId : string, apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/admin/activate-user?userId=${userId}`, {
            method: 'PUT',
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

export const AdminResetUserPassword = async (userId : string, password : string, expirePassword : boolean, apiUrl : string) => {
    try {
        const response = await fetch(`${apiUrl}/user/admin/reset-user-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ userId, password, expirePassword })
        });

        if (!response.ok) {
            const data = await response.json();
            return data;
        }

        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}

export const AdminCreateUserAccessExpirations = async (userId : string, expireStartDate : string, expireEndDate : string, reason : string, apiUrl : string) => {
    try {
        const body = JSON.stringify({
            userId,
            expireStartDate,
            expireEndDate,
            reason
        });
        const response = await fetch(`${apiUrl}/user/admin/create-user-access-expiration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: body
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

export const AdminDeleteUserAccessExpiration = async (expireId : string , apiUrl : string) : Promise<boolean> => {
    try {
        const response = await fetch(`${apiUrl}/user/admin/delete-user-access-expiration?expireId=${expireId}`, {
            method: 'DELETE',
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

export const GetAccountants = async (apiUrl : string) : Promise<SimpleUser[]> => {
    try {
        const response = await fetch(`${apiUrl}/user/accountants`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return [] as unknown as SimpleUser[];
        }

        const data = await response.json();

        const accountants = data as SimpleUser[];
        return accountants;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}

export const GetManagers = async (apiUrl : string) : Promise<SimpleUser[]> => {
    try {
        const response = await fetch(`${apiUrl}/user/managers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return [] as unknown as SimpleUser[];
        }

        const data = await response.json();

        const managers = data as SimpleUser[];
        return managers;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}