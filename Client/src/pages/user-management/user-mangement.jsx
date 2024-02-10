import React  from 'react';
import { useState, useEffect, useRef } from 'react';
import './user-management.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { fetch_users } from '../../services/user_info_service';

const UserManagement = () => {
    const [userFilterOptions, setUserFilterOptions] = useState(['All', 'User', 'Manager', 'Admin']);
    const [activeFilterOptions, setActiveFilterOptions] = useState(['All', 'Active', 'Inactive']);
    const [rowCountOptions, setRowCountOptions] = useState([5, 10, 25 ]);
    const [actionOptions, setActionOptions] = useState(['Deactivate', 'Delete', 'Reset Passwords']);
    const [showActionDropdown, setShowActionDropdown] = useState(false); // New state for managing dropdown visibility
    const dropdownRef = useRef(null); // Create a ref for the dropdown

    //selected filter options
    const [selectedUserFilter, setSelectedUserFilter] = useState('All');
    const [selectedActiveFilter, setSelectedActiveFilter] = useState('All');
    const [selectedRowCount, setSelectedRowCount] = useState(5);


    const [hasFetchedUsers, setHasFetchedUsers] = useState(false) // New state for storing fetched users
    const [fetchedUsers, setFetchedUsers] = useState([]); // New state for storing fetched users


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

    // Fetch users when the component mounts
    useEffect(() => {
        async function fetchUsers() {
            if (hasFetchedUsers) return; // If we've already fetched the users, return early
            //convert user type to int 0 for all, 1 for user, 2 for manager, 3 for admin
            let userType = 0;
            switch (selectedUserFilter) {
                case 'User':
                    userType = 1;
                    break;
                case 'Manager':
                    userType = 2;
                    break;
                case 'Admin':
                    userType = 3;
                    break;
                default:
                    userType = 0;
                    break;
            }

            //convert active status to int 0 for all, 1 for active, 2 for inactive
            let activeStatus = 0;
            switch (selectedActiveFilter) {
                case 'Active':
                    activeStatus = 1;
                    break;
                case 'Inactive':
                    activeStatus = 2;
                    break;
                default:
                    activeStatus = 0;
                    break;
            }

            const response = await fetchUsers(selectedRowCount, 0, userType, activeStatus);
            setHasFetchedUsers(true);
            console.log(response);

            //setFetchedUsers(data);
        }

        fetchUsers();
    }, []);

    return (
       <div className='page-container'>
            <div className='user-management-hotbar'>
                <div className='flex flex-col items-start w-fit'>
                    <p>Search</p>
                    <input type='text' className='search-bar' />
                </div>
                <div className='flex flex-col items-start w-fit'>
                    <h3>User Filter</h3>
                    <select className='filter-dropdown'>
                        {userFilterOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>
                        })}
                    </select>
                </div>
                <div className='flex flex-col items-start w-fit'>
                    <h3>Active Filter</h3>
                    <select className='filter-dropdown'>
                        {activeFilterOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>
                        })}
                    </select>
                </div>
                <div className='flex flex-col items-start w-fit ml-auto'>
                    <button className="icon-button secondary">
                        <FontAwesomeIcon icon={faArrowsRotate} />
                    </button>
                </div>
                <div className='flex flex-col items-start w-fit' ref={dropdownRef}>
                    <h3>Actions</h3>
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
                </div>
                <div className='flex flex-col items-start w-fit'>
                    <h3>Row Count</h3>
                    <select className='filter-dropdown'>
                        {rowCountOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>
                        })}
                    </select>
                </div>
               
            </div>
       </div>
    );
};

export default UserManagement;