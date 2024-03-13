import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Adjust the path as necessary
import AdminResetUserPasswordModal from '../admin-reset-user-password/admin-reset-user-password-modal';
import { User } from '../interfaces/Users';

interface ActionOption {
    label: string;
    action: () => Promise<void> | void; // Adjusted to allow for both async and sync functions
  }
  
  interface ActionsDropdownProps {
    actionOptions: ActionOption[]; // New prop for passing action options and their handlers
  }


  const ActionDropdown = forwardRef<HTMLDivElement, ActionsDropdownProps>(
    ({actionOptions }, ref) => {
    const [showActionDropdown, setShowActionDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
   


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


    // const actionHandlers = {
    //     'Deactivate': async () => {
    //         const result = await deactivateUsers(userIds);
    //         onActionComplete(result);
    //     },
    //     'Activate': async () => {
    //         const result = await activateUsers(userIds);
    //         onActionComplete(result);
    //     },
    //     'Delete': () => setShowConfirmDeleteModal(true),
    //     'Reset Password': async () => {
    //         setShowResetPasswordModal(true);
    //     },
    //     'Edit': async () => {
    //         setShowEditModal(true); 
    //     },
    //     'Unlock Account': async () => {
    //         const result = await unlockAccounts(userIds);
    //         onActionComplete(result);
    //     },
    // };

    // const getActionOptions = () => {
    //     let actions = ['Activate', 'Deactivate', 'Delete', 'Reset Password', 'Edit', 'Unlock Account'];

    //     // Filter actions based on the actionConfig prop
    //     if (actionConfig) {
    //         if (actionConfig.include) {
    //             actions = actions.filter(action => actionConfig.include?.includes(action));
    //         }
    //         if (actionConfig.exclude) {
    //             actions = actions.filter(action => !(actionConfig.exclude?.includes(action)));
    //         }
    //     }
    
    //     return actions;
    // };

    return (
        <div className='flex flex-col items-start w-fit' ref={dropdownRef}>
            <button onClick={() => setShowActionDropdown(prev => !prev)} className='actions-button'>Actions</button>
            {showActionDropdown && (
                <div className='action-dropdown'>
                    {actionOptions.map((option, index) => (
                        <button
                            key={index}
                            className='dropdown-action-button'
                            onClick={(e) => {
                                e.stopPropagation();
                                option.action();
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

export default ActionDropdown;
