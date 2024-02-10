import React, {useState} from 'react';
import './signin-signup.css';
import {useNavigate} from 'react-router-dom';
import { admin_signin_service, user_signin_service } from '../../services/auth_service';
import logo from '../../assets/llp-logo.png';

const AdminSignin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handlesignin = async () => {
        try {
            const response = await admin_signin_service(username, password);

            //print value of response to console
            console.log(response);

            if (response === true) {
                console.log('signin successful');

                //redirect to home page
                navigate('/');

            } else {
                console.log('signin failed:', response);
            }
        } catch (error) {
            //print error to console
            console.error(error);
        }
    };

    

    return (
        <div className='admin-signin-page'>
            <div className="signin-modal">
                <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                    <img src={logo} alt="logo" width={75}/>
                    <h1>Ledger Link Pro</h1>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-8">
                    <h2>Admin Sign In</h2>
                </div>  
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                    <p>Username<strong>*</strong></p>
                    <input type="text" placeholder="Username" className="signin-input" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                    <p>Password<strong>*</strong></p>
                    <input type="password" placeholder="Password" className="signin-input" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-2">
                    <p>Forgot password? <a href="/forgot-password">Reset Password</a></p>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-4">
                    <p>Keep me signed in</p>
                    <input type="checkbox" />
                </div>


                <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                    <button className="admin-signin-btn" onClick={handlesignin}>Sign In</button>
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                    <p>Don't have an account? <a href="/admin-signup">Sign Up</a></p>
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-4">
                    <p>Looking for User signin? <a href="/user-signin">User Signin</a></p>
                </div>
            
            </div>
        </div>
    );
};

export default AdminSignin;
