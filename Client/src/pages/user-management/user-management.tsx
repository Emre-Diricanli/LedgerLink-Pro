import React  from 'react';
import { useState, useEffect, useRef } from 'react';
import './user-management.css';
import { fetch_users as fetchUsersFromService } from '../../services/user_info_service';
import UserTable from '../../components/user-table/user-table';
import SelectedUserInfo from '../../components/user-management/selected-user-info';
import CircularProgress from '@mui/material/CircularProgress';
import { User } from '../../components/interfaces/user-management';
import CreateNewUserModal from '../../components/create-new-user/CreateNewUserModal'
import UserManagementHotbar from '../../components/user-management/user-management-hotbar';

const UserManagement: React.FC = () => {
    const [isCreateNewUserModalOpen, setCreateNewUserModalOpen] = useState(false);

    const [needsRefresh, setNeedsRefresh] = useState(false);
    const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);
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

            setIsLoading(true); // Set loading to true
            
            const response = await fetchUsersFromService(selectedRowCount, 0, selectedUserFilter, selectedActiveFilter, searchString);

            // If the response is false, we can assume there was an error
            if (response === false) {
                console.error('There was a problem fetching the users');
                alert('There was a problem fetching the users');
                return;
            } else {
                //data is the users list
                console.log(response);
                setFetchedUsers(response);
                setNeedsRefresh(false);
                setActiveUser(response[0]);
            }

            setIsLoading(false); // Set loading to false
        }

        fetchUsers();
    }, [searchString, selectedUserFilter, selectedActiveFilter, selectedRowCount, needsRefresh]);

    //method to handle the modal close event
    const handleModalClose = (wasSuccessful) => {
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