// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction, RejectedJournalEntry, UnapprovedJournalEntry } from '../../interfaces/Accounts';
import { useAuth } from '../../../Providers/AuthProvider';
import JournalEntryRejectionModal from '../modals/TransactionRejcetionModal';
import { useAccounts } from '../../../Providers/AccountsProvider';
import CreateNewTransactionBar from '../../accounts/CreateNewTransactionBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import JournalEntryPostReferenceModal from '../modals/JournalEntryPostReference';


export interface RejectedJournalEntriesTableProps {
    account: Account;
    updateJournalEntries?: () => void;
    forceRefresh?: boolean;
}

const RejectedJournalEntriesTable: React.FC<RejectedJournalEntriesTableProps> = ({ account, updateJournalEntries: updateTransactions, forceRefresh}) => {
    const auth = useAuth();
    const accountsProvider = useAccounts();
    const [canReject, setCanReject] = useState<boolean>(false);
    const [rejectedJournalEntries, setRejectedJournalEntries] = useState<RejectedJournalEntry[]>([]);
    const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedJournalEntry, setSelectedJournalEntry] = useState<RejectedJournalEntry>({} as RejectedJournalEntry);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

    // Add these states for the search fields
    const [amountSearch, setAmountSearch] = useState<string>('');
    const [reasonSearch, setReasonSearch] = useState<string>('');
    const [rejectedBySearch, setRejectedBySearch] = useState<string>('');

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const filterJournalEntries = (journalEntries: RejectedJournalEntry[]) => {
    return journalEntries.filter(journalEntry => {
        const formattedAmount = formatCurrencyString(journalEntry.transactionAmount).replace(/[$,]/g, '');
        const amountMatch = formattedAmount.includes(amountSearch.replace(/[$,]/g, ''));
        const reasonMatch = journalEntry.rejectionReason.toLowerCase().includes(reasonSearch.toLowerCase());
        const rejectedByMatch = journalEntry.rejectedByFullName.toLowerCase().includes(rejectedBySearch.toLowerCase());
        return amountMatch && reasonMatch && rejectedByMatch;
    });
};

    useEffect(() => {
        //fetch unapproved transactions
        const fetchUnapprovedTransactions = async () => {
            const transactions = await accountsProvider.getRejectedJournalEntries(account.accountId);
            setRejectedJournalEntries(transactions);
        }

        fetchUnapprovedTransactions();
        
    }, []);

    useEffect(() => {
        //fetch unapproved transactions
        const fetchUnapprovedTransactions = async () => {

            const transactions = await accountsProvider.getRejectedJournalEntries(account.accountId);
            setRejectedJournalEntries(transactions);
        }

        fetchUnapprovedTransactions();

    }, [forceRefresh]);

    return (
        <>
            <div className="flex flex-col h-full">
                <div className='flex flex-row justify-evenly w-full gap-4 pl-4 pr-4'>
                    <input type="text" placeholder="Search by amount" value={amountSearch} onChange={(e) => setAmountSearch(e.target.value)} />
                    <input type="text" placeholder="Search by reason" value={reasonSearch} onChange={(e) => setReasonSearch(e.target.value)} />
                    <input type="text" placeholder="Search by rejected by" value={rejectedBySearch} onChange={(e) => setRejectedBySearch(e.target.value)} />
                </div>
                
                <table className="accounts-table mt-4">
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Reason</th>
                            <th>Rejected By</th>
                            <th>Rejection Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterJournalEntries(rejectedJournalEntries).map((journalEntry) => (
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