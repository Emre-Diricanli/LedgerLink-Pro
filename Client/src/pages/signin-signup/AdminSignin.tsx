import React, {useState} from 'react';
import './signin-signup.css';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../Providers/AuthProvider';
import { Tooltip } from '@mui/material';

const AdminSignin = () => {
    const logoSrc = '/llp-logo.png'
    const auth = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();

    const handlesignin = async () => {
        try {
            const signinResult = await auth.HandleAdminSignin(username, password);

            if (signinResult === true) {
                navigate('/');
            } else {
                console.log('signin failed:', signinResult);
            }

        } catch (error) {
            //print error to console
            console.error(error);
        }
    };

    

    return (
        <div className='admin-signin-page'>
            <div className="modal-content">
                <div className='modal-body'>
                <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                    <img src={logoSrc} alt="logo" width={75}/>
                    <h1>Ledger Link Pro</h1>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-8">
                    <h2>Admin Sign In</h2>
                </div>  
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                    <p>Username<strong>*</strong></p>
                    <input type="text" placeholder="Username" className="modal-content-input" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                    <p>Password<strong>*</strong></p>
                    <input type="password" placeholder="Password" className="modal-content-input" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-2">
                    <Tooltip title="Reset Your Password">
                    <p>Forgot password? <a href="/forgot-password">Reset Password</a></p>
                    </Tooltip>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-4">
                    <p>Keep me signed in</p>
                    <input type="checkbox" />
                </div>


                <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                    <Tooltip title="Sign in to your account">
                    <button className="admin-signin-btn" onClick={handlesignin}>Sign In</button>
                    </Tooltip>
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                    <Tooltip title="Sign up for a new account">
                        <p>Don't have an account? <a href="/admin-signup">Sign Up</a></p>
                    </Tooltip>
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-4">
                    <Tooltip title = "Go to User Sign in">
                    <p>Looking for User signin? <a href="/user-signin">User Signin</a></p>
                    </Tooltip>
                </div>
                </div>
            
            </div>
        </div>
    );
};

export default AdminSignin;
