// UserTable.js
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './UserTable.css'; // Make sure to create a corresponding CSS file for styling
import '../../pages/user-management/user-management.css';
import { User, UserTableProps } from '../../components/interfaces/user-management';
import { admin_activate_user, admin_deactivate_user, admin_delete_user } from '../../services/user_info_service';
import AdminResetUsetPasswordModal from '../admin-reset-user-password/admin-reset-user-password-modal';
import { admin_unlock_account } from '../../services/auth_service';

const UserTable: React.FC<UserTableProps> = ({ users, onActiveUserChange, onSelectedUsersChange, usersNeedRefresh }) => {
    const [actionOptions] = useState<string[]>(['Edit', 'Deactivate', 'Delete', 'Reset Password']);
    const [visibleDropdownUserId, setVisibleDropdownUserId] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [activeUser, setActiveUser] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [isAdminUserResetPasswordModalOpen, setAdminUserResetPasswordModalOpen] = useState(false);

    const [actionSelectedUser, setActionSelectedUser] = useState<User | null>(null);


    const toggleActionDropdown = (userId: string) => {
        setVisibleDropdownUserId(prevUserId => prevUserId === userId ? null : userId);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setVisibleDropdownUserId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCheckboxChange = (userId: string) => {
        setSelectedUsers(prevSelected => {
            const newSelected = prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId];
            onSelectedUsersChange(newSelected);
            return newSelected;
        });
    };

    const handleRowClick = (userId: string) => {
        setActiveUser(userId);
        onActiveUserChange(userId);
    };

    // Define your action handlers
    const handleEdit = (userId: string) => {
        console.log(`Edit user with id: ${userId}`);
        // Add your edit logic here
    };

    const handleDeactivate = async (userId: string) => {
        console.log(`Deactivate user with id: ${userId}`);

        const response = await admin_deactivate_user(userId);

        if (response === true) {
            console.log('User deactivated successfully');

            // Refresh the user list
            usersNeedRefresh([userId]);
        } else {
            alert('Failed to deactivate user');
        }
    };

    const handleActivate = async (userId: string) => {
        console.log(`Deactivate user with id: ${userId}`);

        const response = await admin_activate_user(userId);

        if (response === true) {
            console.log('User deactivated successfully');

            // Refresh the user list
            usersNeedRefresh([userId]);
        } else {
            alert('Failed to deactivate user');
        }
    };

    const handleDelete = async (userId: string) => {
        console.log(`Delete user with id: ${userId}`);
        
        const response = await admin_delete_user(userId);

        if (response === true) {
            console.log('User deleted successfully');

            // Refresh the user list
            usersNeedRefresh([userId]);
        } else {
            alert('Failed to delete user');
        }
    };

    const handleResetPassword = (userId: string) => {
        console.log(`Reset password for user with id: ${userId}`);
        // Add your reset password logic here

        //find email in user list
        const user = users.find(user => user.userId === userId);

        if (user) {
            setAdminUserResetPasswordModalOpen(true);

            setActionSelectedUser(user);
        }
    };

    const handleResetPasswordModalClose = () => {
        setAdminUserResetPasswordModalOpen(false);

        // Refresh the user list
        usersNeedRefresh(selectedUsers);
    };

    const handleUnlockAccount = async (userId: string) => {
        const response = await admin_unlock_account(userId);

        if (response === true) {
            console.log('User account unlocked successfully');

            // Refresh the user list
            usersNeedRefresh([userId]);
        } else {
            alert('Failed to unlock user account');
        }
    };



    //map action handlers to action names
    const actionHandlers = {
        'Edit': handleEdit,
        'Deactivate': handleDeactivate,
        'Activate': handleActivate,
        'Delete': handleDelete,
        'Reset Password': handleResetPassword,
        'Unlock Account': handleUnlockAccount
    };

    const getActionOptions = (userIsActive: boolean, userIsLockedOut: boolean) => {
        let actions = ['Edit', 'Delete', 'Reset Password'];
        if (userIsActive) {
            actions.push('Deactivate');
        } else {
            actions.push('Activate');
        }

        if (userIsLockedOut) {
            actions.push('Unlock Account');
        }

        return actions;
    };

    return (
        <div>
            <AdminResetUsetPasswordModal email={actionSelectedUser?.email || ''} isOpen={isAdminUserResetPasswordModalOpen} onClose={handleResetPasswordModalClose} />
            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Locked Out</th>
                            <th>Active</th>
                            <th>Last Login</th>
                            <th>Email Confirmed</th>
                            <th>Password Expiration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                                <tr 
                                    key={user.userId} 
                                    onClick={() => handleRowClick(user.userId)}
                                    className={activeUser === user.userId ? 'active-user-row' : ''}
                                >
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.userId)}
                                        onChange={(e) => {
                                            e.stopPropagation(); // Prevent row click when interacting with the checkbox
                                            handleCheckboxChange(user.userId);
                                        }}
                                    />
                                </td>
                                <td>{user.username}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td style={{ color: user.lockedOut ? 'red' : 'green' }}>{user.lockedOut ? 'Yes' : 'No'}</td>
                                <td>{user.isActive ? 'Yes' : 'No'}</td>
                                <td>{new Date(user.lastLogin).toLocaleString()}</td>
                                <td>{user.confirmedEmail ? 'Yes' : 'No'}</td>
                                <td>{user.passwordExpiration ? new Date(user.passwordExpiration).toLocaleString() : ''}</td>
                                <td>
                                    <button onClick={() => toggleActionDropdown(user.userId)} className='actions-button'>
                                        Actions
                                    </button>
                                    {visibleDropdownUserId === user.userId && (
                                        <div className='action-dropdown-user' ref={dropdownRef}>
                                            {getActionOptions(user.isActive, user.lockedOut).map((option, index) => (
                                                <button 
                                                    key={index} 
                                                    className='dropdown-action-button'
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click when interacting with the button
                                                        actionHandlers[option](user.userId);
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
