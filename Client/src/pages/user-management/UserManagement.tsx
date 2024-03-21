import React  from 'react';
import { useState, useEffect, useRef } from 'react';
import './user-management.css';
import UserTable from '../../components/user-table/UserTable';
import SelectedUserInfo from '../../components/user-management/SelectedUserInfo';
import CircularProgress from '@mui/material/CircularProgress';
import { User } from '../../components/interfaces/Users';
import CreateNewUserModal from '../../components/create-new-user/CreateNewUserModal'
import UserManagementHotbar from '../../components/user-management/user-management-hotbar';
import { useUser } from '../../Providers/UserProvider';

const UserManagement: React.FC = () => {
    const userProvider = useUser();
    const [isCreateNewUserModalOpen, setCreateNewUserModalOpen] = useState(false);

    const [fetchedUsers, setFetchedUsers] = useState<User[]>([]); // Remove this line
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const [activeUser, setActiveUser] = useState<User | null>(null);

    const [selectedUserFilter, setSelectedUserFilter] = useState<number>(0);
    const [selectedActiveFilter, setSelectedActiveFilter] = useState<number>(2);
    const [selectedRowCount, setSelectedRowCount] = useState(5);
    const [searchString, setSearchString] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for tracking loading status
    //--------------------------------------------------------------------------------NEW
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    //--------------------------------------------------------------------------------NEW

    //used for deleting a user and telling the user table to refresh
    const handleRefreshUsers = (selectedUserIds: string[]) => {
        setNeedsRefresh(true);
        setTimeout(() => {
            setNeedsRefresh(false);
        }, 0);
    };

    const handleActiveUserChange = (userId: string) => {
        const user = fetchedUsers.find(user => user.userId === userId);
        setActiveUser(user || null);
      };

    const handleSelectedUsersChange = (selectedUserIds: string[]) => {
        console.log('Selected users:', selectedUserIds);
        setSelectedUserIds(selectedUserIds);
    };

    // Fetch users when the component mounts //TODO extract this to a custom hook
    useEffect(() => {
        async function fetchUsers() {

            //setIsLoading(true); // Set loading to true //Commented out because it causes weird page reload behavior. its not weird its to be expected
            
            // Fetch users from the service
            const response = await userProvider.FetchUsers(selectedRowCount, 0, selectedUserFilter, selectedActiveFilter, searchString);

            setFetchedUsers(response || []); //if response is empty then set the fetched users to an empty array

            // //if response is not empty then set the active user to the first user in the response
            if (response && response.length > 0) {
                setFetchedUsers(response);
                setActiveUser(response[0]);
            } else {
                setFetchedUsers([]);
                setActiveUser(null);
            }

            //setIsLoading(false); // Set loading to false
        }

        fetchUsers();
    }, [searchString, selectedUserFilter, selectedActiveFilter, selectedRowCount, needsRefresh]);

    //method to handle the modal close event
    const handleModalClose = (wasSuccessful : boolean) => {
        setCreateNewUserModalOpen(false);
        if (wasSuccessful) {
            setNeedsRefresh(true);

            setTimeout(() => {
                setNeedsRefresh(false);
            }, 0);
        } 
    };

    //when actions complete, refresh the users and update the user if error
    const handleActionComplete = (result: boolean) => {
        if (result) {
            setNeedsRefresh(true);
            setTimeout(() => {
                setNeedsRefresh(false);
            }, 0);
        } else {
            alert('There was a problem with the action');
        }
    };

    return (
       <div className='page-container'>
            <CreateNewUserModal isOpen={isCreateNewUserModalOpen} onClose={handleModalClose} />
            <UserManagementHotbar
                    rowCount={setSelectedRowCount} // Fix for problem 1
                    userFilter={setSelectedUserFilter}
                    activeFilter={setSelectedActiveFilter}
                    setCreateNewUserModalOpen={setCreateNewUserModalOpen}
                    userIds={selectedUserIds}
                    actionComplete={handleActionComplete}
                    searchString={setSearchString}
                />
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