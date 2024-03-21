import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HandleConfirmUserAccess } from '../../services/AuthService';
import '../signin-signup/signin-signup.css';
import { useAuth } from '../../Providers/AuthProvider';

//todo remove the navbar from the confirm user page

const ConfirmUser = () => {
    const logoSrc = '/llp-logo.png'
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    
    // Create a function to parse query parameters
    const query = new URLSearchParams(location.search);
    const email = query.get("email");
    const name = query.get("name"); // Make sure this matches the URL parameter key

    useEffect(() => {
        // You can now call the async function inside useEffect
        const confirmAccess = async () => {
            if(email) {
                console.log(email);
                const response = await auth.HandleConfirmUserAccess(email);

                if (response === false) {
                    alert('There was an error confirming the user. Please try again.');
                }
            }
        };

        confirmAccess();
    }, [email]); // Adding email and username as dependencies

    return (
        <div className='admin-signin-page'>
            <div className="signin-modal">
                <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                    <img src={logoSrc} alt="logo" width={75}/>
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
