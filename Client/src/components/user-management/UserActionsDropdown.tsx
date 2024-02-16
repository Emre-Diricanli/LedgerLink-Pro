import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Adjust the path as necessary
import { activateUsers, deactivateUsers, deleteUsers, updateUser, unlockAccounts } from './UsersActionService';
import ConfirmUserDeleteModal from './ConfirmUserDeleteModal';
import AdminResetUserPasswordModal from '../admin-reset-user-password/admin-reset-user-password-modal';
import EditUserModal from './EditUserInfoModal';
import { User } from '../interfaces/user-management';

interface UserActionDropdownProps {
    user?: User;
    userIds: string[];
    onActionComplete: (success?: boolean) => void; // New prop for action completion callback
    actionConfig: { include?: string[]; exclude?: string[] }; // New prop for specifying action options
}


const ActionDropdown = forwardRef<HTMLDivElement, UserActionDropdownProps>(({user, userIds, onActionComplete, actionConfig }, ref) => {
    const [showActionDropdown, setShowActionDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);


    // Close the dropdown if clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowActionDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const confirmDelete = async (confirm: boolean) => {
        if (confirm) {
            // Delete the users and handle the result
            const result = await deleteUsers(userIds);
            onActionComplete(result); // Pass the result back up
        }
        // Close the modal and dropdown
        setShowConfirmDeleteModal(false);
        setShowActionDropdown(false);
    };

    const handleResetPasswordModalClose = (success: boolean) => {
        setShowResetPasswordModal(false);
        setShowActionDropdown(false);
        onActionComplete(success);
    };

    const handleEditModalClose = async (needsUpdate: boolean, newUser: User) => {
        if(needsUpdate && user) {
            //update the user and handle the result
            const result = await updateUser(newUser);
            onActionComplete(result); // Pass the result back up
        }

        setShowEditModal(false);
        setShowActionDropdown(false);
    };

    const actionHandlers = {
        'Deactivate': async () => {
            const result = await deactivateUsers(userIds);
            onActionComplete(result);
        },
        'Activate': async () => {
            const result = await activateUsers(userIds);
            onActionComplete(result);
        },
        'Delete': () => setShowConfirmDeleteModal(true),
        'Reset Password': async () => {
            setShowResetPasswordModal(true);
        },
        'Edit': async () => {
            setShowEditModal(true); 
        },
        'Unlock Account': async () => {
            const result = await unlockAccounts(userIds);
            onActionComplete(result);
        },
    };

    const getActionOptions = () => {
        let actions = ['Activate', 'Deactivate', 'Delete', 'Reset Password', 'Edit', 'Unlock Account'];

        // Filter actions based on the actionConfig prop
        if (actionConfig) {
            if (actionConfig.include) {
                actions = actions.filter(action => actionConfig.include?.includes(action));
            }
            if (actionConfig.exclude) {
                actions = actions.filter(action => !(actionConfig.exclude?.includes(action)));
            }
        }
    
        return actions;
    };

    return (
        <div className='flex flex-col items-start w-fit' ref={dropdownRef}>
            {user && <EditUserModal user={user} isOpen={showEditModal} onClose={handleEditModalClose} />}
            <AdminResetUserPasswordModal userId={userIds[0] || ''} isOpen={showResetPasswordModal} onClose={handleResetPasswordModalClose} />
            <ConfirmUserDeleteModal isOpen={showConfirmDeleteModal} onClose={confirmDelete} />
            <h3>Actions</h3>
            <button onClick={() => setShowActionDropdown(prev => !prev)} className='actions-button'>Actions</button>
            {showActionDropdown && (
                <div className='action-dropdown'>
                    {getActionOptions().map((option, index) => (
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
    );
});

export default ActionDropdown;
