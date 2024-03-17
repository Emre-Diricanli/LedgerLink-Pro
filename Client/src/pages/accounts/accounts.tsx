import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileCsv, faFileExport, faPlus } from '@fortawesome/free-solid-svg-icons';
import AccountsHotbar from '../../components/accounts/AccountsHotbar';
import AccountsTable from '../../components/accounts/Table/AccountsTable';
import { useAccounts } from '../../Providers/AccountsProvider';
import { Account } from '../../components/interfaces/Accounts';
import { CircularProgress } from '@mui/material';

const Accounts: React.FC = () => {
    const accountsProvider = useAccounts();
    const [isCreateNewAccountModalOpen, setCreateNewAccountModalOpen] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const [activeAccount, setActiveAccount] = useState<Account | null>(null);
    const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
    const [selectedActiveFilter, setSelectedActiveFilter] = useState<number>(2);
    const [selectedRowCount, setSelectedRowCount] = useState(5);
    const [searchString, setSearchString] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for tracking loading status

    const handleRefreshAccounts = (selectedAccountIds: string[]) => {
        setNeedsRefresh(true);
        setTimeout(() => {
            setNeedsRefresh(false);
        }, 0);
    };

    const handleActiveAccountChange = (accountId: string) => {
        const account = accountsProvider.accounts.find(account => account.accountId === accountId);
        setActiveAccount(account || null);
      };

    const handleSelectedAccountsChange = (selectedAccountIds: string[]) => {
        console.log('Selected users:', selectedAccountIds);
        setSelectedAccountIds(selectedAccountIds);
    };

    // Fetch users when the component mounts //TODO extract this to a custom hook
    useEffect(() => {
        async function fetchAccounts() {

            //setIsLoading(true); // Set loading to true //Commented out because it causes weird page reload behavior. its not weird its to be expected
            
            // Fetch users from the service
            const response = await accountsProvider.fetchAccounts(selectedRowCount, 0, selectedActiveFilter, searchString, false);

            if (accountsProvider.accounts != null) {
                setActiveAccount(accountsProvider.accounts[0]);
            }

            //setIsLoading(false); // Set loading to false
        }

        fetchAccounts();
    }, [searchString, selectedActiveFilter, selectedRowCount]);

    //method to handle the modal close event
    const handleModalClose = (wasSuccessful : boolean) => {
        setCreateNewAccountModalOpen(false);
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
            <AccountsHotbar 
                rowCount={setSelectedRowCount}
                typeFilter={setSelectedTypeFilter}
                activeFilter={setSelectedActiveFilter}
                accountIds={selectedAccountIds}
                actionComplete={handleActionComplete}
                searchString={setSearchString} 

            />
            { isLoading ? ( 
                <div className='flex flex-col w-full h-full justify-center items-center'>
                    <CircularProgress value={80} />
                </div>
            ): (
                <div className='flex flex-row justify-between w-full h-full pl-8'>
                    <AccountsTable
                        accounts={accountsProvider.accounts}
                        onActiveAccountChange={handleActiveAccountChange}
                        onSelectedAccountsChange={handleSelectedAccountsChange} // Ensure this is correctly passed
                        accountsNeedRefresh={handleRefreshAccounts}
                        />

                    {/* {activeUser && <SelectedUserInfo selectedUser={activeUser} />} */}
                </div>
            )}
            
        </div>
    );
}

export default Accounts;