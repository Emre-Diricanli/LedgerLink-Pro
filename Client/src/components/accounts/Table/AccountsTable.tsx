// UserTable.js
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Account } from '../../interfaces/Accounts';
import AccountsActionDropdown from '../AccountActionsDropdown';
import { useAccounts } from '../../../Providers/AccountsProvider';
import TransactionsButton from '../TransactionsButton';
import '../AccountsComponents.css';
import ViewAccountButton from '../ViewAccountButton';

export interface AccountsTableProps {
    accounts: Account[];
    onActiveAccountChange: (accountId: string) => void;
    onSelectedAccountsChange: (accountIds: string[]) => void;
    accountsNeedRefresh: (accountIds: string[]) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onActiveAccountChange, onSelectedAccountsChange, accountsNeedRefresh }) => {
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [activeAccount, setActiveAccount] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const accountsProvider = useAccounts();
    const [actionCompleted, setActionCompleted] = useState(false);
    
    // Listen for changes to the closeDropdown prop
    useEffect(() => {
        //select first user by default
        if (accounts.length > 0){
            setActiveAccount(accounts[0].accountId);
            onActiveAccountChange(accounts[0].accountId);
        }
    }, [accounts]);

    const actionConfig = (isActive: boolean) => {
        // Define the action options based on the user's active and locked status.
        const actions: string[] = [];
        if (isActive) {
            actions.push('Deactivate');
        } else {
            actions.push('Activate');
        }

        actions.push('Delete');
        actions.push('Edit');

        return { include: actions };
    };

    const handleCheckboxChange = (accountId: string) => {
        setSelectedAccounts(prevSelected => {
            const newSelected = prevSelected.includes(accountId)
                ? prevSelected.filter(id => id !== accountId)
                : [...prevSelected, accountId];
            onSelectedAccountsChange(newSelected);
            return newSelected;
        });
    };

    const handleRowClick = (accountId: string) => {
        setActiveAccount(accountId);
        onActiveAccountChange(accountId);
    };

    const onActionComplete = (result?: boolean, updatedAccount? : Account[]) => {
        //null check
        if (activeAccount === null) {
            return;
        }

        if (result) {

            //close the dropdown
            setActionCompleted(prev => !prev); // Toggle the actionCompleted state

            // If the updated account is provided, find the index of the account in the list and update it
            if (updatedAccount) {
                console.log('updatedAccounts', updatedAccount);
                accountsProvider.replaceAccount(updatedAccount);
            }
            
        } else {
            console.log('Action failed');
        };
    };

    //refresh the accounts
    const refreshAccounts = () => {
        accountsNeedRefresh(selectedAccounts);
    };

    // Define a function to handle the select all checkbox change
    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            // If currently not all users are selected, select all
            setSelectedAccounts(accounts.map(user => user.accountId));

            onSelectedAccountsChange(accounts.map(user => user.accountId));
        } else {
            // If currently all users are selected, deselect all
            setSelectedAccounts([]);
        }
    };

    return (
        <div>

            {accounts.length === 0 ? (
                <div className='w-full h-full flex flex-col'>
                    <h3 className='mt-16'>To get started please create an Account</h3>
                </div>
            ) : (
                <div className="accounts-table-container">
                    <table className="accounts-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                </th>
                                <th>Account Name</th>
                                <th>Account Number</th>
                                <th>Category</th>
                                <th>Sub Category</th>
                                <th>Status</th>
                                <th>Balance</th>
                                <th>Actions</th>
                                <th>Transactions</th>
                                <th>View Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                    <tr 
                                        key={account.accountId} 
                                        onClick={() => handleRowClick(account.accountId)}
                                        className={activeAccount === account.accountId ? 'active-user-row' : ''}
                                    >
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedAccounts.includes(account.accountId)}
                                            onChange={(e) => {
                                                e.stopPropagation(); // Prevent row click when interacting with the checkbox
                                                handleCheckboxChange(account.accountId);
                                            }}
                                        />
                                    </td>
                                    <td>{account.accountName}</td>
                                    <td>{account.accountNumber}</td>
                                    <td>{account.category}</td>
                                    <td>{account.subcategory}</td>
                                    <td>{account.activeStatus ? 'Active' : 'Inactive'}</td>
                                    <td>${account.balance}</td>
                                    <td>
                                        <AccountsActionDropdown ref={dropdownRef} account={account} accountIds={[activeAccount || '']} showText={false} onActionComplete={onActionComplete} actionConfig={actionConfig(account.activeStatus)} closeDropdown={actionCompleted}/>
                                    </td>
                                    <td>
                                        <TransactionsButton account={account} needsRefresh={refreshAccounts}/>
                                    </td>
                                    <td>
                                        <ViewAccountButton account={account} needsRefresh={refreshAccounts}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             ) }
                
            
        </div>
    );
};

export default AccountsTable;