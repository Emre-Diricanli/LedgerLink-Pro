import React, { useState, useEffect } from 'react';
import ModalFooter from '../Modal/ModalFooter';
import ModalHeader from '../Modal/ModalHeader';
import ModalBody from '../Modal/ModalBody';
import { useUser } from '../../Providers/UserProvider';
import { GetAccountants, GetManagers } from '../../services/UserService';
import { SystemsProvider, useSystems } from '../../Providers/SystemsProvider';
import { SimpleUser } from '../interfaces/Users';

interface ContactModalProps {
    contactManager: boolean;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

interface User {
    username: string;
    fullname: string;
    email: string;
}

const ContactModal: React.FC<ContactModalProps> = ({contactManager, isOpen, onClose }) => {
    if (!isOpen) return null;

    const userProvider = useUser();
    const systems = useSystems();

    const [users, setUsers] = useState<SimpleUser[]>([]);

    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (contactManager === true) {
                const apiUrl = systems.apiUrl;
                const managers = await GetManagers(apiUrl);
                setUsers(managers);
            } else {
                const apiUrl = systems.apiUrl;
                const accountants = await GetAccountants(apiUrl);
                setUsers(accountants);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className="modal-backdrop" onClick={() => onClose(false)}>
            <div className="view-account-modal-content" onClick={handleModalClick}>
                <ModalHeader mainText="Contact" subText={contactManager ? "Manager" : "Accountant"} />
                    <ModalBody styles={{ padding: 0 }}>
                        <table className='w-full text-center'>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <a href={`mailto:${user.email}`}>
                                                <button>Email</button>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ModalBody>
                <ModalFooter hideCancel={true} onActionCancel={() => onClose(false)} onActionComplete={() => onClose(false)} />
            </div>
        </div>
    );
};

export default ContactModal;