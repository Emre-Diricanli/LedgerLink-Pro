import React, { useState, useEffect } from 'react';
import '../create-new-user/CreateNewUserModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { admin_create_user_access_expiration } from '../../services/user_info_service';
import { User } from '../interfaces/user-management';

interface EditUserModalProps {
    user: User;
    isOpen: boolean;
    onClose: (boolean,User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose }) => {

    const [newUser, setNewUser] = useState<User>(user);

    const [roleOptions, setRoleOptions] = useState<string[]>([]);
    const roleMapping = {
        'Admin': 3,
        'Manager': 2,
        'User': 1,
    }

    const revertChanges = () => {
        setNewUser(user);
    };

    const handleUpdateUser = async () => {
        onClose(true, newUser);
    }

    const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
    };
    
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => onClose(false, user)}>
      <div className="modal-content" onClick={handleModalClick}>
        <div className="flex flex-row items-center justify-start gap-2 w-full pb-2">
            <h2>Edit {newUser.firstName + ' ' + newUser.lastName}</h2>
        </div>
        <div className="flex flex-row gap-2 content-center justify-center w-full pt-4">
            <img src={newUser.profilePictureUrl || 'vite.svg'} alt="User Profile" className="rounded-full" width={150}/>
        </div>
        <div className="flex flex-row gap-2 content-center justify-start w-full pt-4">
            <div className="flex flex-col w-1/2">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
            </div>
            <div className="flex flex-col w-1/2">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}/>
            </div>
        </div>
        <div className="flex flex-row gap-2 content-center justify-start w-full pt-4">
            <div className="flex flex-col w-full">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}/>
            </div>
            <div className="flex flex-col w-full">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" value={newUser.role} className='filter-dropdown' onChange={(e) => setNewUser({ ...newUser, role: roleMapping[e.target.value] })}>
                    {Object.keys(roleMapping).map((role, index) => (
                        <option key={index} value={role}>{role}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="flex flex-row gap-2 content-center justify-start w-full pt-4">
            <div className="flex flex-col justify-center items-center w-full">
                <p>Locked</p>
                <button className={user.lockedOut ? "primary-button" : "locked-button"} disabled={!user.lockedOut}>
                    Unlock
                </button>
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                <p>Active</p>
                <label className="switch">
                    <input type="checkbox" checked={newUser.isActive} onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })} />
                    <span className="slider round"></span>
                </label>
            </div> 
        </div>
        <div className="flex flex-row items-center justify-center gap-2 w-full mt-8">
            <span className="flex-grow-0">
                <button className="icon-button redo-button" onClick={() => revertChanges()}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
            </span>

            <div className="flex flex-row items-center justify-center gap-2 flex-grow">
                <button className="centered-button" onClick={() => onClose(true, null)}>
                    Cancel
                </button>
                <button className="centered-button" onClick={() => handleUpdateUser()}>
                    Save
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
