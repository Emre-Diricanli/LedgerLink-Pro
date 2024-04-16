// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction } from '../../interfaces/Accounts';
import '../AccountsComponents.css';
import { useAuth } from '../../../Providers/AuthProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import JournalEntryRejectionModal from '../../ledger/modals/TransactionRejcetionModal';
import ViewTransactionRejectionModal from '../Modals/ViewTransactionRejectionModal';
import { useAccounts } from '../../../Providers/AccountsProvider';
import JournalEntryPostReferenceModal from '../../ledger/modals/JournalEntryPostReference';

export interface TransactionsTableProps {
    account: Account;
    onActiveTransactionChange?: (accountId: string) => void;
    transactions: AccountTransaction[];
    forceRefresh?: boolean;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ account, onActiveTransactionChange, transactions}) => {
    const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<AccountTransaction>({} as AccountTransaction);
    
    // Add these states at the beginning of your component
    const [nameSearch, setNameSearch] = useState<string>('');
    const [amountSearch, setAmountSearch] = useState<string>('');
    const [dateSearch, setDateSearch] = useState<string>('');

    // Add this function to handle the filtering of transactions
    const filterTransactions = (transactions: AccountTransaction[]) => {
    return transactions.filter(transaction => {
        const nameMatch = transaction.transactionDescription.toLowerCase().includes(nameSearch.toLowerCase());

        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.credit || transaction.debit);

        const amountMatch = formattedAmount.includes(amountSearch.replace(/[$,]/g, ''));
        const dateMatch = new Date(transaction.transactionDate).toLocaleString().includes(dateSearch);
        return nameMatch && amountMatch && dateMatch;
    });
};

    const handleRowClick = (transactionId: string) => {
        setActiveTransaction(transactionId);
        if (onActiveTransactionChange) {
            onActiveTransactionChange(transactionId);
        }
    };

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const showJournalEntryPostReferenceModal = (transaction: AccountTransaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    return (
        <>
            <JournalEntryPostReferenceModal transaction={selectedTransaction} isOpen={isModalOpen} onClose={setIsModalOpen} />
            <div className="transactions-table-container p-6">
            <div className='flex flex-row justify-evenly w-full gap-4'>
                <input type="text" placeholder="Search by name" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} />
                <input type="text" placeholder="Search by amount" value={amountSearch} onChange={(e) => setAmountSearch(e.target.value)} />
                <input type="text" placeholder="Search by date" value={dateSearch} onChange={(e) => setDateSearch(e.target.value)} />
            </div>
                
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Credit</th>
                            <th>Debit</th>
                            <th>Pre Entry</th>
                            <th>Post Entry</th>
                            <th>User</th>
                            <th>PR</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filterTransactions(transactions).map((transaction) => (
                                <tr 
                                    key={transaction.transactionId} 
                                    onClick={() => handleRowClick(transaction.transactionId ?? '')}
                                    className={activeTransaction === transaction.transactionId ? 'active-user-row' : ''}
                                >
                                <td>{new Date(transaction.transactionDate).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                                <td>{transaction.transactionDescription}</td>
                                <td>{formatCurrencyString(transaction.credit)}</td>
                                <td>{formatCurrencyString(transaction.debit)}</td>
                                <td>{formatCurrencyString(transaction.beforeTransactionBalance)}</td>
                                <td>{formatCurrencyString(transaction.afterTransactionBalance)}</td>
                                <td>{transaction.user}</td>
                                <td>
                                    <button onClick={() => showJournalEntryPostReferenceModal(transaction)} className='icon-button'>
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                    </button>
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