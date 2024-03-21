// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction } from '../../interfaces/Accounts';
import '../AccountsComponents.css';

export interface TransactionsTableProps {
    account: Account;
    onActiveTransactionChange?: (accountId: string) => void;
    transactions: AccountTransaction[];
     
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ account, onActiveTransactionChange, transactions}) => {
    const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
    

    const handleRowClick = (transactionId: string) => {
        setActiveTransaction(transactionId);
        if (onActiveTransactionChange) {
            onActiveTransactionChange(transactionId);
        }
    };



    return (
        <div className="transactions-table-container p-6">
            <table className="accounts-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Before Transaction</th>
                        <th>After Transaction</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                            <tr 
                                key={transaction.transactionId} 
                                onClick={() => handleRowClick(transaction.transactionId ?? '')}
                                className={activeTransaction === transaction.transactionId ? 'active-user-row' : ''}
                            >
                            {/* <td>
                                <input
                                    type="checkbox"
                                    checked={selectedAccounts.includes(account.accountId)}
                                    onChange={(e) => {
                                        e.stopPropagation(); // Prevent row click when interacting with the checkbox
                                        handleCheckboxChange(account.accountId);
                                    }}
                                />
                            </td> */}
                            <td>{new Date(transaction.transactionDate).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                            <td>${transaction.transactionAmount}</td>
                            <td>${transaction.beforeTransactionBalance}</td>
                            <td>${transaction.afterTransactionBalance}</td>
                            <td>{transaction.transactionDescription}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsTable;