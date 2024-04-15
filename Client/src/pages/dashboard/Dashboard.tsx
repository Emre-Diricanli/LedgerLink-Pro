import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './dashboard.css'
import { useUser } from '../../Providers/UserProvider';
import { useAuth } from '../../Providers/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { HandleUserSignout } from '../../services/AuthService';

const Dashboard = () => {
    const userProvider = useUser();
    const logoSrc = '/llp-logo-alpha.png';


    // useEffect(() => {
    //     //verify role status
    //     const verifyRoleStatus = async () => {
    //         try {
    //             // Call the auth_service API to get the auth level
    //             const authLevel = await auth.HandleGetRole();

    //         } catch (error) {
    //             // Handle any errors that occurred during the API call
    //             console.error('Error:', error);
    //         }
    //     };

    //     verifyRoleStatus();
    // }, []);

    const handleSignout = async () => {
        try {
          await signOut(); // Call the signOut method from AuthContext
          // navigate('/signin'); // Redirect user to the sign-in page or another appropriate page
        } catch (error) {
          console.error('Sign-out failed:', error);
          alert('Sign-out failed');
        }
      };



    return (
        <>
            <div className='flex flex-col justify-top items-center w-full h-full'>
                <h1 className="font-serif text-x1">LedgerLink PRO</h1>
                <h2 className="font-serif text-x1">Welcome {userProvider.user ? `, ${userProvider.user?.firstName}!` : '...'} </h2>
                <img src={logoSrc} alt="logo" width={400}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="flex justify-center">
                    <Tooltip title='Go to Chart of Accounts'>
                    <Link to="/accounts" className="m-4 p-10 bg-blue-500 text-white rounded">Accounts</Link>
                    </Tooltip>
                    <Tooltip title='Go to User Management Page'>
                    <Link to="/user-management" className="m-4 p-10 bg-blue-500 text-white rounded">User Management</Link>
                    </Tooltip>
                    <Tooltip title='Sign out of Account'>
                    <button className="m-4 p-8 bg-blue-500 text-white rounded" onClick={handleSignout}>Sign Out</button> 
                    </Tooltip>
                </div>
            </div>

        </>
    );
};

export default Dashboard;

function signOut() {
    throw new Error('Function not implemented.');
}
