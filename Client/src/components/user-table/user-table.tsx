// UserTable.js
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './UserTable.css'; // Make sure to create a corresponding CSS file for styling
import '../../pages/user-management/user-management.css';
import { User, UserTableProps } from '../../components/interfaces/user-management';

const UserTable: React.FC<UserTableProps> = ({ users, onActiveUserChange, onSelectedUsersChange }) => {
    const [actionOptions] = useState<string[]>(['Edit', 'Deactivate', 'Delete', 'Reset Password']);
    const [visibleDropdownUserId, setVisibleDropdownUserId] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [activeUser, setActiveUser] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

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

    return (
        <div className="user-table-container">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>Last Login</th>
                        <th>Email Confirmed</th>
                        <th>Password Expiration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId} onClick={() => handleRowClick(user.userId)}>
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
                            <td>{user.role}</td>
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
                                        {actionOptions.map((option, index) => (
                                            <button key={index} className='dropdown-action-button'>
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
    );
};

export default UserTable;
