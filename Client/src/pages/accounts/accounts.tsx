import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileCsv, faFileExport, faPlus } from '@fortawesome/free-solid-svg-icons';
import AccountsTable from '../../components/accounts/accountsTable';
import AccountsHotbar from '../../components/accounts/AccountsHotbar';

const accounts: React.FC = () => {
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
    const [selectedActiveFilter, setSelectedActiveFilter] = useState<number>(2);
    const [selectedRowCount, setSelectedRowCount] = useState(5);
    const [searchString, setSearchString] = useState('');
    const [createNewAccountModalOpen, setCreateNewAccountModalOpen] = useState(false);

    
    return (
        <div className='page-container'>
            <AccountsHotbar 
                rowCount={setSelectedRowCount}
                typeFilter={setSelectedTypeFilter}
                activeFilter={setSelectedActiveFilter}
                accountIds={[]}
                actionComplete={() => {}}
                searchString={setSearchString} 

            />
            {/* <div className='flex flex-row justify-between w-full p-6'>
                <h3>Summary</h3>
                <div className='flex flex-row gap-8'>
                    <p>Accounts: 25</p>
                    <p>Assets: $100,000</p>
                </div>
            </div> */}

            
            <AccountsTable />
            
        </div>
    );
}

export default accounts;