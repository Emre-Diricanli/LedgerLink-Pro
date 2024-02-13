import React from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../signin-signup/signin-signup.css';
import logo from '../../assets/llp-logo.png';
import { new_user_reset_password } from '../../services/auth_service';

const NewUserResetPassword = () => {
    const[newPassword, setNewPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const id = query.get("id");


    const handlePasswordChange = async () => {
        //check if passwords match
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const response = await new_user_reset_password(newPassword, id);

        if (response === true) {
            console.log('password reset successful');

            //redirect to home page
            navigate('/');
        }
        else if( response === 409){
            alert('Password was previously used. please use a different password');
        }
        else {
            alert('password reset failed');
        }
    };

    return (
        <div className='signin-page'>
            <div className="signin-modal">
                <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                    <img src={logo} alt="logo" width={75}/>
                    <h1>Ledger Link Pro</h1>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-8">
                    <h2>Reset Password</h2>
                </div>  
                
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                    <p>New Password<strong>*</strong></p>
                    <input type="password" placeholder="New Password" className="modal-content-input" onChange={(e) => setNewPassword(e.target.value)} />
                </div>

                <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                    <p>Confirm Password<strong>*</strong></p>
                    <input type="password" placeholder="Confirm New Password" className="modal-content-input" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                    <button className="signin-btn" onClick={handlePasswordChange}>Reset Password</button>
                </div>

            </div>
        </div>
    );
};

export default NewUserResetPassword;