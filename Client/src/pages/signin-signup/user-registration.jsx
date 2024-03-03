import React, {useState} from 'react';
import './signin-signup.css';
import {useNavigate} from 'react-router-dom';
import { user_signin_service, user_signup_service } from '../../services/auth_service';
import logo from '../../assets/llp-logo.png';

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


    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await user_signup_service(username, firstName, lastName, dob, streetAddress, city, state, zipCode, apptNumber);

            //print value of response to console
            console.log(response);

            if (response) {
                //set access requested to true
                setAccessRequested(true);
               
            } else {
                alert('There was an error with your request. Please try again.');
            }
        } catch (error) {
            //print error to console
            console.error(error);
        }
    };

    

    return (
        <div className='signin-page'>
            <div className="modal-content">
                <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                    <img src={logo} alt="logo" width={75}/>
                    <h1>Ledger Link Pro</h1>
                </div>

                <div className="flex flex-row content-center justify-start gap-2 w-full pt-8">
                    <h2>User Registration</h2>
                </div>  
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                    <p>Email<strong>*</strong></p>
                    <input type="text" placeholder="Email" className="modal-content-input" onChange={(e) => setUsername(e.target.value)} maxLength={40}/>
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
                    <p>Date of Birth<strong>*</strong></p>
                    <input type="date" placeholder="DOB" className="modal-content-input" value={dob} onChange={(e) => setDob(e.target.value)}/>
                </div>
                <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
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
    );
};

export default UserRegistration;
