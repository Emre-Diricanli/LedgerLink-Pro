import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirm_user_access } from '../../services/auth_service';
import logo from '../../assets/llp-logo.png';
import '../signin-signup/signin-signup.css';

//todo remove the navbar from the confirm user page

const ConfirmUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Create a function to parse query parameters
    const query = new URLSearchParams(location.search);
    const email = query.get("email");
    const username = query.get("username");
    const name = query.get("name"); // Make sure this matches the URL parameter key

    useEffect(() => {
        // You can now call the async function inside useEffect
        const confirmAccess = async () => {
            if(email && username) {
                console.log(email, username);
                const response = await confirm_user_access(email, username);
                console.log(response); // Handle the response appropriately
            }
        };

        confirmAccess();
    }, [email, username]); // Adding email and username as dependencies

    return (
        <div className='admin-signin-page'>
            <div className="signin-modal">
                <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                    <img src={logo} alt="logo" width={75}/>
                    <h1>Ledger Link Pro</h1>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-8">
                    <h2>User Confirmation</h2>
                </div>  
                
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                    <p><strong>{name || '__'}</strong> has been successfully confirmed. They will receive an email with their login credentials.</p>
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-8">
                    <button className="signin-button" onClick={() => navigate('/')}>Home</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmUser;
