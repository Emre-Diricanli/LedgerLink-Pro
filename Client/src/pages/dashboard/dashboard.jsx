import React, { useEffect } from 'react';
import { get_auth_level } from '../../services/auth_service';

const Dashboard = () => {
    // Component logic goes here

    useEffect(() => {
        //verify role status
        const verifyRoleStatus = async () => {
            try {
                // Call the auth_service API to get the auth level
                const authLevel = await get_auth_level();

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
        <>
            <h2>Hello World!</h2>
        </>
    );
};

export default Dashboard;