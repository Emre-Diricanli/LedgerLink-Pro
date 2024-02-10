import React, { useEffect, useState } from 'react';
import logo from '../../assets/llp-logo.png';
import { useLocation } from 'react-router-dom';
import '../signin-signup/signin-signup.css';
import { confirm_email, resend_confirmation_email as resendEmailService } from '../../services/auth_service';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const AdminConfirmEmail = () => {
    let query = useQuery();
    let token = query.get("token");
    let email = query.get("email");
    const [isEmailConfirmed, setEmailConfirmed] = useState(null);
    const [madeCall, setMadeCall] = useState(false);
    const [resendStatus, setResendStatus] = useState(null); // null, 'success', or 'failure'

    useEffect(() => {
        const confirmEmail = async () => {
            if (madeCall) return;
            try {
                console.log('Email:', email);
                console.log('Token:', token);
                const response = await confirm_email(email, token);
                setMadeCall(true);
                setEmailConfirmed(response);
            } catch (error) {
                console.error('Error:', error);
                setEmailConfirmed(false); // Assuming failure to confirm in case of error
            }
        };
        confirmEmail();
    }, [email, token, madeCall]);

    const resend_confirmation_email = async () => {
        try {
            const response = await resendEmailService(email); // Renamed imported function to avoid name conflict
            if (response === true) {
                console.log('Email sent successfully');
                setResendStatus('success');
            } else {
                setResendStatus('failure');
            }
        } catch (error) {
            console.error('Error:', error);
            setResendStatus('failure');
        }
    };

    return (
        <div className='admin-signin-page'>
            <div className="signin-modal">
                <div className="flex flex-row items-center justify-start gap-2 w-full pb-8">
                    <img src={logo} alt="logo" width={75}/>
                    <h1>Ledger Link Pro</h1>
                </div>

                {isEmailConfirmed ? (
                    <div className="flex flex-col text-center items-center justify-center gap-2 w-full h-full">
                        <h3>Your email account has been confirmed. You may now sign in to your account.</h3>
                        <button className="admin-signin-btn mt-8" onClick={() => window.location.href = '/admin-signin'}>Sign In</button>
                    </div>
                ) : isEmailConfirmed === false ? (
                    <>
                        {resendStatus === 'success' ? (
                            <div className="flex flex-col text-center items-center justify-center gap-2 w-full h-full">
                                <h3>Confirmation email resent successfully. Please check your inbox.</h3>
                                <button className="admin-signin-btn mt-8" onClick={() => window.location.href = '/admin-signin'}>Go to Sign In</button>
                            </div>
                        ) : resendStatus === 'failure' ? (
                            <div className="flex flex-col text-center items-center justify-center gap-2 w-full h-full">
                                <h3>Failed to resend confirmation email. Please try again later or contact support for assistance.</h3>
                                <button className="signin-button" onClick={() => window.location.href = '/contact-support'}>Contact Support</button>
                            </div>
                        ) : (
                            <div className="flex flex-col text-center content-center justify-center gap-2 w-full pt-8">
                                <h3>Unable to confirm your email. Please try again or contact support for assistance.</h3>
                                <button className="signin-button" onClick={resend_confirmation_email}>Resend Email</button>
                                <button className="signin-button" onClick={() => window.location.href = '/contact-support'}>Contact Support</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default AdminConfirmEmail;
