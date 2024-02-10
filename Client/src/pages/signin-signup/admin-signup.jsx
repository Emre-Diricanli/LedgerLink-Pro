import React, {useState} from 'react';
import './signin-signup.css';
import {useNavigate} from 'react-router-dom';
import { admin_signin_service, admin_signup_service, user_signin_service } from '../../services/auth_service';
import logo from '../../assets/llp-logo.png';

const AdminSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            //ensure password and confirm password match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const response = await admin_signup_service(email, password, firstName, lastName);

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
                <div className="flex flex-row gap-2 content-center justify-start w-full pt-8">
                    <div className="flex flex-col content-center justify-start gap-0 w-full ">
                        <p>First Name<strong>*</strong></p>
                        <input type="text" placeholder="First Name" className="signin-input" onChange={(e) => setFirstName(e.target.value)} maxLength={30}/>
                    </div>
                    <div className="flex flex-col content-center justify-start gap-0 w-full ">
                        <p>Last Name<strong>*</strong></p>
                        <input type="text" placeholder="Last Name" className="signin-input" onChange={(e) => setLastName(e.target.value)} maxLength={30}/>
                    </div>
                </div>
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                    <p>Email<strong>*</strong></p>
                    <input type="text" placeholder="Email" className="signin-input" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                    <p>Password<strong>*</strong></p>
                    <input type="password" placeholder="Password" className="signin-input" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                    <p>Confirm Password<strong>*</strong></p>
                    <input type="password" placeholder="Confirm Password" className="signin-input" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-2">
                    <p>Forgot password? <a href="/forgot-password">Reset Password</a></p>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-4">
                    <p>Keep me signed in</p>
                    <input type="checkbox" />
                </div>


                <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                    <button className="admin-signin-btn" onClick={handleSignup}>Sign In</button>
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                    <p>Already have an account? <a href="/admin-signup">Sign In</a></p>
                </div>

                <div className="flex flex-row content-center justify-center gap-2 w-full pt-4">
                    <p>Looking for User signup? <a href="/user-signin">User Signup</a></p>
                </div>
            
            </div>
        </div>
    );
};

export default AdminSignup;
