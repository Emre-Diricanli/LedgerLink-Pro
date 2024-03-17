import { useState, useEffect, useRef, forwardRef } from 'react';

// Adjust the path as necessary
import ConfirmDeleteModal from '../Modal/ConfirmDeleteModal';
import EditAccountModal from './Modals/EditAccountModal';
import { Account } from '../interfaces/Accounts';
import { useAccounts } from '../../Providers/AccountsProvider';

interface UserActionDropdownProps {
    account?: Account;
    accountIds: string[];
    showText?: boolean;
    showDropDown?: boolean;
    closeDropdown?: boolean;
    onActionComplete: (success?: boolean, updatedAccount? : Account[]) => void; // New prop for action completion callback
    actionConfig: { include?: string[]; exclude?: string[] }; // New prop for specifying action options
}

const AccountsActionDropdown = forwardRef<HTMLDivElement, UserActionDropdownProps>(({account, accountIds, showText = true, onActionComplete, actionConfig, closeDropdown }, ref) => {
    const [showActionDropdown, setShowActionDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const accountsProvider = useAccounts();

    // Listen for changes to the closeDropdown prop
    useEffect(() => {
        if (closeDropdown) {
            setShowActionDropdown(false);
        }
    }, [closeDropdown]);

    // Close the dropdown if clicking outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowActionDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const confirmDelete = async (confirm: boolean) => {
        if (confirm) {
            // Delete the users and handle the result
            const result = await accountsProvider.deleteAccounts(accountIds);
            onActionComplete(result); // Pass the result back up
        }
        // Close the modal and dropdown
        setShowConfirmDeleteModal(false);
        setShowActionDropdown(false);
    };

    const handleEditModalClose = async (needsUpdate: boolean, newAccount: Account) => {
        if(needsUpdate && account) {
            //update the user and handle the result
            const result = await accountsProvider.updateAccount(newAccount);
            onActionComplete(result); // Pass the result back up
        }

        setShowEditModal(false);
        setShowActionDropdown(false);
    };

    const actionHandlers: { [key: string]: () => Promise<void> | void } = {
        'Deactivate': async () => {
            const result = await accountsProvider.deactivateAccounts(accountIds);

            //if true then update account
            if (result) {
                //find accounts to update under the accountIds
                const updatedAccounts = accountsProvider.accounts.filter(account => accountIds.includes(account.accountId));

                //Update to inactive
                updatedAccounts.forEach(account => {
                    account.activeStatus = false;
                });

                onActionComplete(result, updatedAccounts);
                
            } else {
                onActionComplete(result);
            }
        },
        'Activate': async () => {
            const result = await accountsProvider.activateAccounts(accountIds);

            //if true then update account
            if (result) {
                //find accounts to update under the accountIds
                const updatedAccounts = accountsProvider.accounts.filter(account => accountIds.includes(account.accountId));

                //Update to active
                updatedAccounts.forEach(account => {
                    account.activeStatus = true;
                });

                onActionComplete(result, updatedAccounts);
               
            } else {
                onActionComplete(result);
            }

        },
        'Delete': () => setShowConfirmDeleteModal(true),
        'Edit': async () => {
            setShowEditModal(true);
        },
    };

    const getActionOptions = () => {
        let actions = ['Activate', 'Deactivate', 'Delete', 'Edit', ];

        // Filter actions based on the actionConfig prop
        if (actionConfig) {
            if (actionConfig.include) {
                actions = actions.filter(action => actionConfig.include?.includes(action));
            }
            if (actionConfig.exclude) {
                actions = actions.filter(action => !(actionConfig.exclude?.includes(action)));
            }
        }
    
        return actions;
    };

    return (
        <div className='flex flex-col items-start w-fit' ref={dropdownRef}>
            {account && <EditAccountModal account={account} isOpen={showEditModal} onClose={handleEditModalClose} />}
            <ConfirmDeleteModal isOpen={showConfirmDeleteModal} onClose={confirmDelete} headerText='Confirm Delete Account' bodyText='Are you sure you want to delete this account(s)'/>
            {showText && <p>Actions</p>}
            <button onClick={() => setShowActionDropdown(prev => !prev)} className='actions-button'>Actions</button>
            {showActionDropdown && (
                <div className='action-dropdown'>
                    {getActionOptions().map((option, index) => (
                        <button 
                            key={index} 
                            className='dropdown-action-button'
                            onClick={(e) => {
                                e.stopPropagation();
                                actionHandlers[option] && actionHandlers[option]();
                            }}>
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

export default AccountsActionDropdown;