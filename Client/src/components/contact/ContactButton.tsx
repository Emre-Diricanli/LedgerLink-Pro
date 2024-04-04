import { useState, useRef, useEffect } from 'react';
import './ContactButton.css'
import ContactModal from './ContactModal';
import { Tooltip } from '@mui/material';

const ContactDropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [showModal, setShowModal] = useState(false);
    const [contactManager, setContactManager] = useState(false);

    const handleModalClose = () => {
        setShowModal(false);
    }

    // Close the dropdown if clicking outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const actionHandlers: { [key: string]: () => void } = {
        'Manager': () => {
            setContactManager(true);
            setShowModal(true);
            setShowDropdown(false);
        },
        'Accountant': () => {
            setContactManager(false);
            setShowModal(true);
            setShowDropdown(false);
        },
    };

    return (
       <>
       <ContactModal contactManager={contactManager} isOpen={showModal} onClose={handleModalClose} />
        <div className='flex flex-col items-start w-fit' ref={dropdownRef}>
            <Tooltip title='Contact LedgerLink Pro'>
            <button onClick={() => setShowDropdown(prev => !prev)} className='contact-button'>Contact</button>
            </Tooltip>
            {showDropdown && (
                <div className='action-dropdown' style={{ right: 20 }}>
                    {['Manager', 'Accountant'].map((option, index) => (
                        <button 
                            key={index} 
                            className='dropdown-action-button'
                            onClick={(e) => {
                                e.stopPropagation();
                                actionHandlers[option] && actionHandlers[option]();
                            }}>
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default ContactDropdown;