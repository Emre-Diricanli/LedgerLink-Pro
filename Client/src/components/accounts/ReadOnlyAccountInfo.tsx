import React from 'react';
import { Account } from '../interfaces/Accounts';

interface ReadOnlyAccountInfoProps {
    account: Account;
}

const ReadOnlyAccountInfo: React.FC<ReadOnlyAccountInfoProps> = ({ account }) => {
    return (
        <div>
            <p>Account Name: <input type="text" value={account.accountName} readOnly /></p>
            <p>Account Number: <input type="number" value={account.accountNumber} readOnly /></p>
            <p>Description: <textarea value={account.description} readOnly /></p>
            <p>Category: <input type="text" value={account.category} readOnly /></p>
            <p>Sub-Category: <input type="text" value={account.subcategory} readOnly /></p>
        </div>
    );
};

export default ReadOnlyAccountInfo;