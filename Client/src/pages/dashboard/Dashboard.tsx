import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../util/UserProvider';
import { useAuth } from '../../util/AuthProvider';

const Dashboard = () => {
    const {user, fetchUser } = useUser();
    // Component logic goes here
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        //verify role status
        const verifyRoleStatus = async () => {
            try {
                // Call the auth_service API to get the auth level
                const authLevel = await auth.HandleGetRole();

            } catch (error) {
                // Handle any errors that occurred during the API call
                console.error('Error:', error);
            }
        };

        verifyRoleStatus();
    }, []);

    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <h1>Welcome{user ? `, ${user.firstName}!` : '...'} </h1>
            <h2 className='mt-8'>This Dashboard is a work in progress.</h2>
        </div>
    );
};

export default Dashboard;