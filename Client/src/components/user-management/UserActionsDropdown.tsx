import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Adjust the path as necessary
import { ActivateUsers, DeactivateUsers, DeleteUsers, UpdateUser, UnlockAccounts, ResendConfirmationEmail } from './UsersActionService';
import ConfirmUserDeleteModal from '../Modal/ConfirmDeleteModal';
import AdminResetUserPasswordModal from '../admin-reset-user-password/AdminResetUserPassword';
import EditUserModal from './EditUserInfoModal';
import { User } from '../interfaces/Users';
import { useSystems } from '../../Providers/SystemsProvider';
import { Tooltip } from '@mui/material';

interface UserActionDropdownProps {
    user?: User;
    userIds: string[];
    showText?: boolean;
    onActionComplete: (success?: boolean) => void; // New prop for action completion callback
    actionConfig: { include?: string[]; exclude?: string[] }; // New prop for specifying action options
}


const ActionDropdown = forwardRef<HTMLDivElement, UserActionDropdownProps>(({user, userIds, showText = true, onActionComplete, actionConfig }, ref) => {
    const [showActionDropdown, setShowActionDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const systems = useSystems();

    


    // Close the dropdown if clicking outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
            const result = await DeleteUsers(userIds, systems.apiUrl);
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
            const result = await UpdateUser(newUser, systems.apiUrl);
            onActionComplete(result); // Pass the result back up
        }

        setShowEditModal(false);
        setShowActionDropdown(false);
    };

    const actionHandlers: { [key: string]: () => Promise<void> | void } = {
        'Deactivate': async () => {
            const result = await DeactivateUsers(userIds, systems.apiUrl);
            onActionComplete(result);
        },
        'Activate': async () => {
            const result = await ActivateUsers(userIds, systems.apiUrl);
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
            const result = await UnlockAccounts(userIds, systems.apiUrl);
            onActionComplete(result);
        },
        'Resend Confirmation Email': async () => {
            const result = await ResendConfirmationEmail(userIds, systems.apiUrl);
            onActionComplete(result);
        }
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
            {showText && <p></p>}
            <Tooltip title='Show Actions'>
            <button onClick={() => setShowActionDropdown(prev => !prev)} className='actions-button'>Actions</button>
            </Tooltip>
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
