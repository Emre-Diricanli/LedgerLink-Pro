import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import ActionDropdown from './UserActionsDropdown';
import HotbarActionsDropdown from './UserActionsDropdown';
import { Tooltip } from '@mui/material';

interface UserManagementHotbarProps {
    setCreateNewUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userIds: string[];
    actionComplete: (success: boolean) => void;
    userFilter: React.Dispatch<React.SetStateAction<number>>;
    activeFilter: React.Dispatch<React.SetStateAction<number>>;
    rowCount: React.Dispatch<React.SetStateAction<number>>;
    searchString: React.Dispatch<React.SetStateAction<string>>;
}

const UserManagementHotbar: React.FC<UserManagementHotbarProps> = ({
    setCreateNewUserModalOpen,
    userIds,
    actionComplete,
    userFilter,
    activeFilter,
    rowCount,
    searchString,
}) => {

    const userFilterMapping = {
        All: 0,
        Admin: 3,
        Manager: 2,
        User: 1,
    };

    const activeFilterMapping = {
        All: 2,
        Active: 1,
        Inactive: 0,
    };

    const [userFilterOptions, setUserFilterOptions] = useState(['All', 'Admin', 'Manager', 'User']);
    const [activeFilterOptions, setActiveFilterOptions] = useState(['All', 'Active', 'Inactive']);
    const [rowCountOptions, setRowCountOptions] = useState([5, 10, 25]);
    const [searchValue, setSearchValue] = useState('');
    
    const dropdownRef = useRef(null);
    const actionConfig = {
        include: ['Deactivate', 'Activate', 'Delete']
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            searchString(searchValue);
        }, 500); // 500ms delay

        return () => clearTimeout(timer); // cleanup on unmount or when searchValue changes
    }, [searchValue, searchString]);

    // Hotbar content goes here, similar to what was inside UserManagement component
    return (
        <div className='hotbar justify-start '>
                <div className='flex flex-col items-start w-fit'>
                    <p>Search</p>
                    <input
                        type='text'
                        className='search-bar'
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}
                    />
                </div>
                <div className='flex flex-col items-start w-fit'>
                    <p>User Filter</p>
                    <select
                        
                        onChange={(e) => {
                            // Get the numeric value from the mapping based on the selected text
                            const selectedValue = userFilterMapping[e.target.value];
                            // Pass the numeric value to the parent component
                            userFilter(selectedValue); // Assuming `userFilter` is the prop function passed for this purpose
                        }}
                    >
                        {userFilterOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>;
                        })}
                    </select>

                </div>
                <div className='flex flex-col items-start w-fit'>
                    <p>Active Filter</p>
                    <select
                        
                        onChange={(e) => {
                            // Get the numeric value from the mapping based on the selected text
                            const selectedValue = activeFilterMapping[e.target.value];
                            // Pass the numeric
                            activeFilter(selectedValue); // Assuming `activeFilter` is the prop function passed for this purpose
                        }
                        }
                    >
                        {activeFilterOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>;
                        })}
                    </select>
                </div>
                <div className='flex flex-col items-start w-fit'>
                    {/* <p>Create User</p> */}
                    <Tooltip title='Create a New User'>
                    <button onClick={() => setCreateNewUserModalOpen(true)}>Create</button>
                    </Tooltip>
                    
                </div>
                <div className='flex flex-col items-start w-fit ml-auto'>
                    <Tooltip title='Refresh Page'>
                    <button className="icon-button secondary" onClick={() => actionComplete(true)}>
                        <FontAwesomeIcon icon={faArrowsRotate} />
                    </button>
                    </Tooltip>
                </div>
                <div className='flex flex-col items-start w-fit' > {/* ref={dropdownRef} */}
                <Tooltip title='Show Actions'>
                    <ActionDropdown ref={dropdownRef} userIds={userIds} onActionComplete={actionComplete} actionConfig={actionConfig}/>
                </Tooltip>
                </div>
                <div className='flex flex-col items-start w-fit'>
                    <p>Row Count</p>
                    <select
                        className='filter-dropdown'
                        onChange={(e) => {
                            rowCount(parseInt(e.target.value));
                        }}
                    >
                        {rowCountOptions.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>;
                        })}
                    </select>
                </div>
               
            </div>
    );
};

export default UserManagementHotbar;
