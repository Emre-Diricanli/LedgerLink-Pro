// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction } from '../../interfaces/Accounts';
import '../AccountsComponents.css';
import { useAuth } from '../../../Providers/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import TransactionRejectionModal from '../Modals/TransactionRejcetionModal';

export interface TransactionsTableProps {
    account: Account;
    onActiveTransactionChange?: (accountId: string) => void;
    transactions: AccountTransaction[];
     
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ account, onActiveTransactionChange, transactions}) => {
    const auth = useAuth();
    const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
    const [canReject, setCanReject] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<AccountTransaction>({} as AccountTransaction);
    

    const handleRowClick = (transactionId: string) => {
        setActiveTransaction(transactionId);
        if (onActiveTransactionChange) {
            onActiveTransactionChange(transactionId);
        }
    };

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const handleApproveTransaction = async (transactionId: string) => {
        // Call the approve transaction function from the accounts provider
    }

    const handleRejectTransaction = async (transactionId: string) => {
        // show modal
        const selectedTransaction = transactions.find(transaction => transaction.transactionId === transactionId);
        setIsModalOpen(true);
    }

    useEffect(() => {
        if (auth.isAdmin || auth.isManager) {
            setCanReject(true);
        }
    }, [auth.isAdmin, auth.isManager]);

    return (
        <>
            <TransactionRejectionModal transaction={selectedTransaction} isOpen={isModalOpen} onClose={setIsModalOpen} />
            <div className="transactions-table-container p-6">
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Before Transaction</th>
                            <th>After Transaction</th>
                            <th>Description</th>
                            <th>Approved</th>
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
                                <td>{formatCurrencyString(transaction.transactionAmount)}</td>
                                <td>{formatCurrencyString(transaction.beforeTransactionBalance)}</td>
                                <td>{formatCurrencyString(transaction.afterTransactionBalance)}</td>
                                <td>{transaction.transactionDescription}</td>
                                <td>
                                    <div className='flex flex-row justify-center content-center items-center'>
                                        <p className='mr-4'>{transaction.isApproved ? 'Yes' : 'No'}</p>
                                        {canReject && (
                                        <div className='flex flex-row gap-1'>
                                                <button className='icon-button' style={{backgroundColor: "red"}} onClick={() => handleRejectTransaction(transaction.transactionId || '')}>
                                                    <FontAwesomeIcon icon={faTimes} size="xs"/>
                                                </button>
                                                <button className='icon-button' style={{backgroundColor: "green"}} onClick={() => handleApproveTransaction(transaction.transactionId || '')}>
                                                    <FontAwesomeIcon icon={faCheck} size='xs'/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TransactionsTable;