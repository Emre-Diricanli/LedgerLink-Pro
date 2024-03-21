import React, {useState} from 'react';
import './signin-signup.css';
import {useNavigate} from 'react-router-dom';
import { HandleAdminSignup } from '../../services/AuthService';
import { useAuth } from '../../Providers/AuthProvider';

const AdminSignup = () => {
    const logoSrc = '/llp-logo.png'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [signupSuccess, setSignupSuccess] = useState(false); // New state for tracking signup success

    const auth = useAuth();
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            //ensure password and confirm password match
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const response = await auth.HandleAdminSignup(email, password, firstName, lastName);

            //if signup is successful, set signupSuccess to true
            if (response === true) {
                setSignupSuccess(true);
            } else {
                alert('Signup failed');
            }
        } catch (error) {
            //print error to console
            console.error(error);
        }
    };

    
    if (signupSuccess) {
        return (
            <div className="confirmation-modal">
                <p>Please check your email for a confirmation message.</p>
                <button onClick={() => navigate('/admin-signin')}>Go to Sign In</button>
            </div>
        );
    }
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
                    <div className="flex flex-row gap-2 content-center justify-start w-full pt-8">
                        <div className="flex flex-col content-center justify-start gap-0 w-full ">
                            <p>First Name<strong>*</strong></p>
                            <input type="text" placeholder="First Name" className="modal-content-input" onChange={(e) => setFirstName(e.target.value)} maxLength={30}/>
                        </div>
                        <div className="flex flex-col content-center justify-start gap-0 w-full ">
                            <p>Last Name<strong>*</strong></p>
                            <input type="text" placeholder="Last Name" className="modal-content-input" onChange={(e) => setLastName(e.target.value)} maxLength={30}/>
                        </div>
                    </div>
                    <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                        <p>Email<strong>*</strong></p>
                        <input type="text" placeholder="Email" className="modal-content-input" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                        <p>Password<strong>*</strong></p>
                        <input type="password" placeholder="Password" className="modal-content-input" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex flex-col content-center justify-start gap-0 w-full pt-6">
                        <p>Confirm Password<strong>*</strong></p>
                        <input type="password" placeholder="Confirm Password" className="modal-content-input" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                
                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                        <button className="admin-signin-btn" onClick={handleSignup}>Register</button>
                    </div>

                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                        <p>Already have an account? <a href="/admin-signin">Sign In</a></p>
                    </div>

                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-4">
                        <p>Looking for User signup? <a href="/user-registration">User Sign Up</a></p>
                    </div>
                </div>
            
            </div>
        </div>
    );
};

export default AdminSignup;
