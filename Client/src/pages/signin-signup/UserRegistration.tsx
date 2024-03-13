import React, {useState} from 'react';
import './signin-signup.css';
import {useNavigate} from 'react-router-dom';
import { HandleUserRequestAccess } from '../../services/AuthService';
import logo from '../../assets/llp-logo.png';
import { useAuth } from '../../util/AuthProvider';
import { UserSignupRequest } from '../../components/interfaces/Users';

//TODO fix naviagation to confirmation page after successful registration

const UserRegistration = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState(new Date().toISOString().split('T')[0]);
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [apptNumber, setApptNumber] = useState('');

    const [accessRequested, setAccessRequested] = useState(false);

    const auth = useAuth();

    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const newUser: UserSignupRequest = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                dob: dob,
                streetAddress: streetAddress,
                city: city,
                state: state,
                zipCode: zipCode,
                apptNumber: apptNumber
            };
            
            const signupResult = await auth.HandleUserSignup(newUser); 

            if (signupResult) {
                setAccessRequested(true);
            } else {
                alert('There was an error with your request. Please try again.');
            }

        } catch (error) {
            //print error to console
            console.error(error);
        }
    };

    
    if (accessRequested) {
        return (
            <div className="confirmation-modal">
                <p>An admin has been notified about your account registration request. You will receive and email when you have been approved. Please hang tight.</p>
                <button onClick={() => navigate('/user-signin')}>Go to Sign In</button>
            </div>
        );
    }
    return (
        <div className='signin-page'>
            <div className="modal-content">
                <div className='modal-body'>
                    <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                        <img src={logo} alt="logo" width={75}/>
                        <h1>Ledger Link Pro</h1>
                    </div>

                    <div className="flex flex-row content-center justify-start gap-2 w-full">
                        <h2>User Registration</h2>
                    </div>  
                    <div className="flex flex-col content-center justify-start gap-0 w-full pt-2">
                        <p>Email<strong>*</strong></p>
                        <input type="text" placeholder="Email" className="modal-content-input" onChange={(e) => setUsername(e.target.value)} maxLength={40}/>
                    </div>
                    <div className="flex flex-row gap-2 content-center justify-start w-full pt-2">
                        <div className="flex flex-col content-center justify-start gap-0 w-full ">
                            <p>First Name<strong>*</strong></p>
                            <input type="text" placeholder="First Name" className="modal-content-input" onChange={(e) => setFirstName(e.target.value)} maxLength={30}/>
                        </div>
                        <div className="flex flex-col content-center justify-start gap-0 w-full ">
                            <p>Last Name<strong>*</strong></p>
                            <input type="text" placeholder="Last Name" className="modal-content-input" onChange={(e) => setLastName(e.target.value)} maxLength={30}/>
                        </div>
                    </div>
                    <div className="flex flex-col content-center justify-start gap-0 w-full pt-2">
                        <p>Date of Birth<strong>*</strong></p>
                        <input type="date" placeholder="DOB" className="modal-content-input" value={dob} onChange={(e) => setDob(e.target.value)}/>
                    </div>
                    <div className="flex flex-col content-center justify-start gap-0 w-full pt-2">
                        <p>Street Address<strong>*</strong></p>
                        <input type="text" placeholder="Street Address" className="modal-content-input" onChange={(e) => setStreetAddress(e.target.value)} maxLength={75}/>
                    </div>
                    <div className="flex flex-row gap-2 content-center justify-start w-full pt-2">
                        <div className="flex flex-col content-center justify-start gap-0 w-full">
                            <p>City<strong>*</strong></p>
                            <input type="text" placeholder="City" className="modal-content-input" onChange={(e) => setCity(e.target.value)} maxLength={50}/>
                        </div>
                        <div className="flex flex-col content-center justify-start gap-0 w-full ">
                            <p>State<strong>*</strong></p>
                            <input type="text" placeholder="State" className="modal-content-input" onChange={(e) => setState(e.target.value)} maxLength={20}/>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 content-center justify-start w-full pt-2">
                        <div className="flex flex-col content-center justify-start gap-0 w-full">
                            <p>Zip Code<strong>*</strong></p>
                            <input 
                                type="text" 
                                placeholder="Zip Code" 
                                className="modal-content-input" 
                                onChange={(e) => setZipCode(e.target.value)}
                                pattern="^\d{5}(-\d{4})?$" 
                                title="Enter a 5-digit zip code"
                                maxLength={5}/>
                        </div>

                        <div className="flex flex-col content-center justify-start gap-0 w-full ">
                            <p>Appt Number<strong>*</strong></p>
                            <input type="text" placeholder="State" className="modal-content-input" onChange={(e) => setApptNumber(e.target.value)} maxLength={20}/>
                        </div>
                    </div>
                    

                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                        <button className="modal-content-btn" onClick={handleSignup}>Request Access</button>
                    </div>

                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
                        <p>Already have an account? <a href="/user-signin">Sign In</a></p>
                    </div>

                    <div className="flex flex-row content-center justify-center gap-2 w-full pt-4">
                        <p>Looking for Admin signin? <a href="/admin-signin">Admin Signin</a></p>
                    </div>
                </div>
            
            </div>
        </div>
    );
};

export default UserRegistration;
