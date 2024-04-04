// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction, RejectedJournalEntry } from '../../interfaces/Accounts';
import { useAuth } from '../../../Providers/AuthProvider';
import TransactionRejectionModal from '../../accounts/Modals/TransactionRejcetionModal';
import { useAccounts } from '../../../Providers/AccountsProvider';
import CreateNewTransactionBar from '../../accounts/CreateNewTransactionBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


export interface RejectedJournalEntriesTableProps {
    account: Account;
}

const RejectedJournalEntriesTable: React.FC<RejectedJournalEntriesTableProps> = ({ account}) => {
    const auth = useAuth();
    const accountsProvider = useAccounts();
    const [canReject, setCanReject] = useState<boolean>(false);
    const [rejectedJournalEntries, setRejectedJournalEntries] = useState<RejectedJournalEntry[]>([]);
    const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedJournalEntry, setSelectedJournalEntry] = useState<RejectedJournalEntry>({} as RejectedJournalEntry);

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const handleApproveTransaction = async (transactionId: string) => {
        // Call the approve transaction function from the accounts provider
    }

    const handleRejectTransaction = async (transactionId: string) => {
        // show modal
        let transaction = rejectedJournalEntries.find((transaction) => transaction.transactionId === transactionId);
        setSelectedJournalEntry(transaction as RejectedJournalEntry);
        setIsModalOpen(true);
    }

    useEffect(() => {
        //fetch unapproved transactions
        const fetchUnapprovedTransactions = async () => {
            const transactions = await accountsProvider.getRejectedJournalEntries(account.accountId);
            setRejectedJournalEntries(transactions);
        }

        fetchUnapprovedTransactions();
        
    }, []);

    useEffect(() => {
        if (auth.isAdmin || auth.isManager) {
            setCanReject(true);
        }
    }, [auth.isAdmin, auth.isManager]);

    return (
        <>
            <div className="flex flex-col justify-between h-full">
                
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Reason</th>
                            <th>Rejected By</th>
                            <th>Rejection Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rejectedJournalEntries.map((journalEntry) => (
                                <tr 
                                    key={journalEntry.transactionId} 
                                    className={activeTransaction === journalEntry.transactionId ? 'active-user-row' : ''}
                                >
                                <td>{formatCurrencyString(journalEntry.transactionAmount)}</td>
                                <td>{journalEntry.rejectionReason}</td>
                                <td>{journalEntry.rejectedByFullName}</td>
                                <td>{journalEntry.rejectionDate.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default RejectedJournalEntriesTable;