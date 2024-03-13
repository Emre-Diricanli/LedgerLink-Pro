import React, {useState} from 'react';
import './signin-signup.css';
import {useNavigate} from 'react-router-dom';
import {HandleUserSignin} from '../../services/AuthService';
import logo from '../../assets/llp-logo.png';
import { useAuth } from '../../util/AuthProvider';
0
const UserSignin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const auth = useAuth();

    const navigate = useNavigate();

    const handlesignin = async () => {
        try {
            const signinResult = await auth.HandleUserSignin(username, password);

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
        <div className='signin-page'>
            <div className="modal-content">
                <div className='modal-body'>
                    <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                        <img src={logo} alt="logo" width={75}/>
                        <h1>Ledger Link Pro</h1>
                    </div>

                    <div className="flex flex-row content-center justify-start gap-2 w-full pt-8">
                        <h2>User Sign In</h2>
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
                        <p>Forgot password? <a href="/forgot-password">Reset Password</a></p>
                    </div>

                    <div className="flex flex-row content-center justify-start gap-2 w-full pt-4">
                        <p>Keep me signed in</p>
                        <input type="checkbox" />
                    </div>


                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                        <button className="modal-content-btn" onClick={handlesignin}>Sign In</button>
                    </div>

                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                        <p>Don't have an account? <a href="/user-registration">Sign Up</a></p>
                    </div>

                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-4">
                        <p>Looking for Admin signin? <a href="/admin-signin">Admin Signin</a></p>
                    </div>
                </div>
            
            </div>
        </div>
    );
};

export default UserSignin;
