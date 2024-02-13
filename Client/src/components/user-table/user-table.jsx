// UserTable.js
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './UserTable.css'; // Make sure to create a corresponding CSS file for styling
import '../../pages/user-management/user-management.css';

const UserTable = ({ users }) => {
    const [actionOptions, setActionOptions] = useState(['Edit', 'Deactivate', 'Delete', 'Reset Password']);
    const [showActionDropdown, setShowActionDropdown] = useState(false); // New state for managing dropdown visibility
    const dropdownRef = useRef(null); // Create a ref for the dropdown


    // Function to toggle the visibility of the action dropdown
    const toggleActionDropdown = () => {
        setShowActionDropdown(prevShow => !prevShow);
    };

    // Close the dropdown if clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowActionDropdown(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="user-table-container">
            <table className="user-table">
                <thead>
                    <tr>
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
                        <tr key={user.userId}>
                            <td>{user.username}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.role}</td>
                            <td>{user.isActive ? 'Yes' : 'No'}</td>
                            <td>{new Date(user.lastLogin).toLocaleString()}</td>
                            <td>{user.confirmedEmail ? 'Yes' : 'No'}</td>
                            <td>{new Date(user.passwordExpiration).toLocaleString()}</td>
                            <td>
                                <button onClick={toggleActionDropdown} className='actions-button'>Actions</button>
                                {showActionDropdown && (
                                    <div className='action-dropdown'>
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
