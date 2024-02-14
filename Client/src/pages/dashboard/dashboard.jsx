import React, { useEffect } from 'react';
import { get_auth_level } from '../../services/auth_service';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // Component logic goes here
    const navigate = useNavigate();

    useEffect(() => {
        //verify role status
        const verifyRoleStatus = async () => {
            try {
                // Call the auth_service API to get the auth level
                const authLevel = await get_auth_level(navigate);

                // Print the auth level to the console
                console.log('Auth Level:', authLevel);
               
            } catch (error) {
                // Handle any errors that occurred during the API call
                console.error('Error:', error);
            }
        };

        verifyRoleStatus();
    }, []);

    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <h1>Welcome to the Dashboard</h1>
            <h2>Work in progress!</h2>
        </div>
    );
};

export default Dashboard;