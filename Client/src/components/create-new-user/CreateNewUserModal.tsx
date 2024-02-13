import { useEffect, useState } from 'react';
import React from 'react';
import './CreateNewUserModal.css';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
    const [username, setUsername] = React.useState('');
    const [defaultUsername, setDefaultUsername] = React.useState(''); // This is the default username for the user, which is generated when the user is created
    const [isntCustomUsername, setIsntCustomUsername] = React.useState(true);

    const [password, setPassword] = React.useState('');
    const [defaultPassword, setDefaultPassword] = React.useState('Password123$'); // This is the default password for the user, which is generated when the user is created
    const [isntCustomPassword, setIsntCustomPassword] = React.useState(true);

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const [email, setEmail] = React.useState('');

    const [roleOptions, setRoleOptions] = React.useState<{[key: string]: number}>({});
    const [selectedRole, setSelectedRole] = React.useState('');


    useEffect(() => {
        //role options are user, manager, admin
        setRoleOptions({User: 1, Manager: 2, Admin: 3});
    }, []);

    const handleUsernameUpdate = () => {
        //username is first initial + last name and random number between 100 and 999
        const randomNum = Math.floor(Math.random() * 900) + 100;
        setDefaultUsername(firstName.charAt(0) + lastName + randomNum);

    };

    const handlePasswordUpdate = () => {
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleCreateNewUser = () => {
    };

    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // This prevents the click from propagating to the backdrop
    };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={handleModalClick}>
        {/* <button onClick={onClose}>Close</button> */}
        <div className="flex flex-row items-center justify-start gap-2 w-full pb-2">
            <h2>Create New User</h2>
        </div>

        <div className="flex flex-col content-center justify-start gap-0 w-full pt-4">
            <p>Role<strong>*</strong></p>
            <select value={selectedRole} onChange={handleRoleChange} className='filter-dropdown'>
            {Object.keys(roleOptions).map((role) => (
                <option key={roleOptions[role]} value={role}>
                    {role}
                </option>
            ))}
        </select>
        </div>
        <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
            <p>Email<strong>*</strong></p>
            <input type="text" placeholder="Email" className="modal-content-input" onChange={(e) => setUsername(e.target.value)} maxLength={40}/>
        </div>
        <div className="flex flex-row gap-2 content-center justify-start w-full pt-8">
            <div className="flex flex-col content-center justify-start gap-0 w-full ">
                <p>First Name<strong>*</strong></p>
                <input type="text" placeholder="First Name" className="modal-content-input" onChange={(e) => { setFirstName(e.target.value); handleUsernameUpdate(); }} maxLength={30}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full ">
                <p>Last Name<strong>*</strong></p>
                <input type="text" placeholder="Last Name" className="modal-content-input" onChange={(e) => { setLastName(e.target.value); handleUsernameUpdate(); }} maxLength={30}/>
            </div>
        </div>
        <div className="flex flex-row gap-2 content-center justify-start w-full pt-8">
            <div className="flex flex-col content-center justify-start gap-0 w-full ">
                <p>Username {!isntCustomUsername ? <strong>*</strong> : <></>}</p>
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="modal-content-input" 
                    onChange={(e) => setUsername(e.target.value)} 
                    maxLength={40}
                    disabled={isntCustomUsername} 
                    value={isntCustomUsername ? defaultUsername : username}
                />
            </div>
            <div className="flex flex-col content-center items-center justify-start gap-0 w-fit ">
                <p>Custom</p>
                <input 
                    type="checkbox" 
                    className="modal-content-input m-auto" 
                    checked={isntCustomUsername} 
                    onChange={(e) => setIsntCustomUsername(e.target.checked)} 
                    />
            </div>
        </div>

        <div className="flex flex-row gap-2 content-center justify-start w-full pt-8">
            <div className="flex flex-col content-center justify-start gap-0 w-full ">
                <p>Password {!isntCustomPassword ? <strong>*</strong> : <></>}</p>
                <input 
                    type="text" 
                    placeholder="Password" 
                    className="modal-content-input" 
                    onChange={(e) => setPassword(e.target.value)} 
                    maxLength={40}
                    disabled={isntCustomPassword} 
                    value={isntCustomPassword ? defaultPassword : password}
                />
            </div>
            <div className="flex flex-col content-center items-center justify-start gap-0 w-fit ">
                <p>Custom</p>
                <input 
                    type="checkbox" 
                    className="modal-content-input m-auto" 
                    checked={isntCustomPassword} 
                    onChange={(e) => setIsntCustomPassword(e.target.checked)} 
                    />
            </div>
        </div>

        <div className="flex flex-row content-center justify-center gap-2 w-full pt-8 pl-4 pr-4">
            <p>This user will receive an email with login credentials asking to confirm their email before signing in.</p>
        </div>
        <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
            <button className="modal-content-btn" onClick={handleCreateNewUser}>Create New User</button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
