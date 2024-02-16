import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import ActionDropdown from './UserActionsDropdown';
import HotbarActionsDropdown from './UserActionsDropdown';

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
        <div className='user-management-hotbar'>
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
                    <h3>User Filter</h3>
                    <select
                        className='filter-dropdown'
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
                    <h3>Active Filter</h3>
                    <select
                        className='filter-dropdown'
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
                    <h3>Create User</h3>
                    <button onClick={() => setCreateNewUserModalOpen(true)}>Create</button>
                    
                </div>
                <div className='flex flex-col items-start w-fit ml-auto'>
                    <button className="icon-button secondary" onClick={() => actionComplete(true)}>
                        <FontAwesomeIcon icon={faArrowsRotate} />
                    </button>
                </div>
                <div className='flex flex-col items-start w-fit' > {/* ref={dropdownRef} */}
                    <ActionDropdown ref={dropdownRef} userIds={userIds} onActionComplete={actionComplete} actionConfig={actionConfig}/>
                </div>
                <div className='flex flex-col items-start w-fit'>
                    <h3>Row Count</h3>
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
