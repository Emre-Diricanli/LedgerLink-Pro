import React, { useEffect } from 'react';
import { check_online_status } from '../../services/auth_service';
import { useLocation, useNavigate } from 'react-router-dom';

const ServerOfflinePage = () => {
    const navigate = useNavigate();
    useEffect (() => {
        //check online status
        const checkOnlineStatus = async () => {
            try {
                const response = await check_online_status();

                if (response === true) {
                    navigate('/user-signin')
                }
            }
            catch (error) {
                console.log('Server Offline');
            }
        }
        checkOnlineStatus();
                
    }, []);

    return (
        <div className='flex flex-col text-center justify-center w-full items-center h-full'>
            <h1>Server Offline</h1>
            <p>We're sorry, but our server is currently offline. Please try again later.</p>
        </div>
    );
};

export default ServerOfflinePage;