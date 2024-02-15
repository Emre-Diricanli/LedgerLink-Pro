import React, { useEffect } from 'react';
import { get_auth_level } from '../../services/auth_service';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    

    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <h1>Hello</h1>
            <h2>Get to know us</h2>
            <h2><a href='https://github.com/Emre-Diricanli/LedgerLink-Pro' target="_blank_">Github</a></h2>
        </div>
    );
};

export default Contact;