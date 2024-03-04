import React from 'react';

interface AccountsSummaryProps {
    NumAccounts: number;
    TotalAssets: number;
}

const AccountsSummary: React.FC<AccountsSummaryProps> = ({ NumAccounts, TotalAssets }) => {
    return (
        <div className='flex flex-row justify-between w-full p-6'>
            <h3>Summary</h3>
            <div className='flex flex-row gap-8'>
                <p>Accounts: {NumAccounts}</p>
                <p>Assets: {TotalAssets}</p>
            </div>
        </div>
    );
}

export default AccountsSummary;