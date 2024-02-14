import React  from 'react';
import { useState, useEffect, useRef } from 'react';
import './user-management.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { fetch_users as fetchUsersFromService } from '../../services/user_info_service';
import UserTable from '../../components/user-table/user-table';
import SelectedUserInfo from '../../components/selected-user-information/selected-user-info';
import CircularProgress from '@mui/material/CircularProgress';
import { User } from '../../components/interfaces/user-management';
import CreateNewUserModal from '../../components/create-new-user/CreateNewUserModal'

  
const UserManagement: React.FC = () => {
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

    const [isCreateNewUserModalOpen, setCreateNewUserModalOpen] = useState(false);


    const [hasFetchedUsers, setHasFetchedUsers] = useState(false) // New state for storing fetched users
    const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);
    const [activeUser, setActiveUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(false); // New state for tracking loading status


    // Function to toggle the visibility of the action dropdown
    const toggleActionDropdown = () => {
        setShowActionDropdown(prevShow => !prevShow);
    };

    const formatDate = (dateString) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };
    

    // Close the dropdown if clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && (dropdownRef.current as HTMLElement).contains(event.target)) {
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

    //used for deleting a user and telling the user table to refresh
    const handleRefreshUsers = (selectedUserIds: string[]) => {
        setHasFetchedUsers(false);
        setTimeout(() => {
            setHasFetchedUsers(true);
        }, 0);
    };

    const handleActiveUserChange = (userId: string) => {
        const user = fetchedUsers.find(user => user.userId === userId);
        setActiveUser(user || null);
      };

      const handleSelectedUsersChange = (selectedUserIds: string[]) => {
      };

    // Fetch users when the component mounts
    useEffect(() => {
        async function fetchUsers() {
            setIsLoading(true); // Set loading to true
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

            const response = await fetchUsersFromService(selectedRowCount, 0, userType, activeStatus);

            // If the response is false, we can assume there was an error
            if (response === false) {
                console.error('There was a problem fetching the users');
                alert('There was a problem fetching the users');
                return;
            } else {
                //data is the users list
                console.log(response);
                setFetchedUsers(response);
                setHasFetchedUsers(true);
                setActiveUser(response[0]);
            }

            setIsLoading(false); // Set loading to false

        }

        fetchUsers();
    }, [selectedUserFilter, selectedActiveFilter, selectedRowCount, hasFetchedUsers]);

    //method to handle the modal close event
    const handleModalClose = (wasSuccessful) => {
        setCreateNewUserModalOpen(false);
        if (wasSuccessful) {
            setHasFetchedUsers(false);

            setTimeout(() => {
                setHasFetchedUsers(true);
            }, 0);
        } 
    };

    return (
       <div className='page-container'>
            <CreateNewUserModal isOpen={isCreateNewUserModalOpen} onClose={handleModalClose} />
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
                <div className='flex flex-col items-start w-fit'>
                    <h3>Create User</h3>
                    <button onClick={() => setCreateNewUserModalOpen(true)}>Create</button>
                    
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
            { isLoading ? ( 
                <div className='flex flex-col w-full h-full justify-center items-center'>
                    <CircularProgress size={80}/>
                </div>
            ): (
                <div className='flex flex-row justify-between w-full h-full pl-8'>
                    <UserTable
                        users={fetchedUsers}
                        onActiveUserChange={handleActiveUserChange}
                        onSelectedUsersChange={handleSelectedUsersChange} // Ensure this is correctly passed
                        usersNeedRefresh={handleRefreshUsers}
                        />

                    {activeUser && <SelectedUserInfo selectedUser={activeUser} />}
                </div>
            )}

       </div>
    );
};

export default UserManagement;