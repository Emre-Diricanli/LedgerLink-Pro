// UserTable.js
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './UserTable.css'; // Make sure to create a corresponding CSS file for styling
import '../../pages/user-management/user-management.css';
import { User } from '../interfaces/Users';
import ActionDropdown from '../user-management/UserActionsDropdown';

export interface UserTableProps {
    users: User[];
    onActiveUserChange: (userId: string) => void;
    onSelectedUsersChange: (userIds: string[]) => void;
    usersNeedRefresh: (userIds: string[]) => void;
  }

const UserTable: React.FC<UserTableProps> = ({ users, onActiveUserChange, onSelectedUsersChange, usersNeedRefresh }) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [activeUser, setActiveUser] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [isAdminUserResetPasswordModalOpen, setAdminUserResetPasswordModalOpen] = useState(false);

    const actionConfig = (isActive: boolean, isLocked: boolean) => {
        // Define the action options based on the user's active and locked status.
        const actions: string[] = [];
        if (isActive) {
            actions.push('Deactivate');
        } else {
            actions.push('Activate');
        }

        if (isLocked) {
            actions.push('Unlock Account');
        }

        actions.push('Reset Password');
        actions.push('Delete');
        actions.push('Edit');
        return { include: actions };
    };

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

    const onActionComplete = (result?: boolean) => {
        //null check
        if (activeUser === null) {
            return;
        }

        if (result) {
            // Refresh the user list
            usersNeedRefresh(selectedUsers);
        } else {
            alert('Failed to perform action');
        }
    };

    const [selectAll, setSelectAll] = useState(false);

    // Define a function to handle the select all checkbox change
    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            // If currently not all users are selected, select all
            setSelectedUsers(users.map(user => user.userId));

            onSelectedUsersChange(users.map(user => user.userId));
        } else {
            // If currently all users are selected, deselect all
            setSelectedUsers([]);
        }
    };

    return (
        <div>
            
            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
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
                                    <ActionDropdown ref={dropdownRef} user={user} userIds={[activeUser || '']} onActionComplete={(result: boolean | undefined) => onActionComplete(result)} actionConfig={actionConfig(user.isActive, user.lockedOut)}/>
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
