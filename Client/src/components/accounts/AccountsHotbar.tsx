import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import ActionsDropdown from '../ActionsDropdown/ActionsDropdown';
import CreateNewAccountModal from './Modals/CreateNewAccountModal';

interface AccountsHotbarProps {
    accountIds: string[];
    actionComplete: (success: boolean) => void;
    typeFilter: React.Dispatch<React.SetStateAction<string>>;
    activeFilter: React.Dispatch<React.SetStateAction<number>>;
    rowCount: React.Dispatch<React.SetStateAction<number>>;
    searchString: React.Dispatch<React.SetStateAction<string>>;
}

const AccountsHotbar: React.FC<AccountsHotbarProps> = ({
    accountIds: accountIds,
    actionComplete,
    typeFilter: typeFilter,
    activeFilter,
    rowCount,
    searchString,
}) => {

    const accountTypes = ['All', 'Debit', 'Credit', 'Revenue', 'Expense', 'Asset', 'Liability', 'Equity'];
    const activeOptions = ['All', 'Active', 'Deactivated'];
    const [rowCountOptions, setRowCountOptions] = useState([5, 10, 25]);
    const [searchValue, setSearchValue] = useState('');
    const dropdownRef = useRef(null);
    const [createNewAccountModalOpen, setCreateNewAccountModalOpen] = useState(false);

    const activate = (userIds: string[]) => {
            console.log('Activating accounts:', userIds);
    }

    const deactivate = (userIds: string[]) => {
            console.log('Deactivating accounts:', userIds);
    }

    const actionConfig = [
            {
                label: 'Activate',
                action: () => activate(accountIds),
            },
            {
                label: 'Deactivate',
                action: () => deactivate(accountIds),
            }
    ];

    const onModalActionComplete = (success: boolean) => {
        //if action complete is successful, refresh the table else close modal and do nothing
        
        //close modal
        setCreateNewAccountModalOpen(false);
        console.log('Action completed:', success);

    }

    useEffect(() => {
        const timer = setTimeout(() => {
            searchString(searchValue);
        }, 500); // 500ms delay

        return () => clearTimeout(timer); // cleanup on unmount or when searchValue changes
    }, [searchValue, searchString]);

    // Hotbar content goes here, similar to what was inside UserManagement component
    return (
        <div className='w-full'>
            <CreateNewAccountModal isOpen={createNewAccountModalOpen} onClose={onModalActionComplete} />
            <div className='hotbar justify-start'>
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
                <p>Account Type</p>
                <select
                    
                    onChange={(e) => typeFilter(e.target.value)}
                >
                    {accountTypes.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>

            </div>
            <div className='flex flex-col items-start w-fit'>
                <p>Status</p>
                <select
                    
                    onChange={(e) => activeFilter(activeOptions.indexOf(e.target.value))}
                >
                    {activeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col items-start w-fit'>
                <p>Create Account</p>
                <button className='w-full' onClick={() => setCreateNewAccountModalOpen(true)}>Create</button>
                
            </div>
            <div className='flex flex-col items-start w-fit ml-auto'>
                <button className="icon-button secondary" onClick={() => actionComplete(true)}>
                    <FontAwesomeIcon icon={faArrowsRotate} />
                </button>
            </div>
            <div className='flex flex-col items-start w-fit' > {/* ref={dropdownRef} */}
                <p>Actions</p>
                <ActionsDropdown 
                actionOptions={actionConfig}
                />
            </div>
            <div className='flex flex-col items-start w-fit'>
                <p>Row Count</p>
                <select
                    
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
        </div>
    );
};

export default AccountsHotbar;
