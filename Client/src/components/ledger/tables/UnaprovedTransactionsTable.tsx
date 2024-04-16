// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction, UnapprovedJournalEntry } from '../../interfaces/Accounts';
import { useAuth } from '../../../Providers/AuthProvider';
import JournalEntryRejectionModal from '../modals/TransactionRejcetionModal';
import { useAccounts } from '../../../Providers/AccountsProvider';
import CreateNewTransactionBar from '../../accounts/CreateNewTransactionBar';
import { PostNewJournalEntry } from '../../../services/AccountsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import CreateJournalEntryModal from '../modals/NewJournalEntryModal';
import JournalEntryPostReferenceModal from '../modals/JournalEntryPostReference';


export interface UnaprovedTransactionsTableProps {
    account: Account;
    updateJournalEntries: () => void;
    forceRefresh?: boolean;
}

const UnapprovedTransactionsTable: React.FC<UnaprovedTransactionsTableProps> = ({ account, updateJournalEntries: updateTransactions, forceRefresh}) => {
    const auth = useAuth();
    const accountsProvider = useAccounts();
    const [canReject, setCanReject] = useState<boolean>(false);
    const [unapprovedTransactions, setUnaprovedTransactions] = useState<UnapprovedJournalEntry[]>([]);
    const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCreateJournalEntryModalOpen, setIsCreateJournalEntryModalOpen] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedJournalEntry, setSelectedJournalEntry] = useState<UnapprovedJournalEntry>({} as UnapprovedJournalEntry);
    const [selectedTransaction, setSelectedTransaction] = useState<UnapprovedJournalEntry>({} as UnapprovedJournalEntry);
    
    const [amountSearch, setAmountSearch] = useState<string>('');
    const [descriptionSearch, setDescriptionSearch] = useState<string>('');
    const [dateSearch, setDateSearch] = useState<string>('');

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const filterTransactions = (transactions: UnapprovedJournalEntry[]) => {
    return transactions.filter(transaction => {
        const formattedAmount = formatCurrencyString(transaction.totalAmount).replace(/[$,]/g, '');
        const amountMatch = formattedAmount.includes(amountSearch.replace(/[$,]/g, ''));
        const descriptionMatch = transaction.transactionDescription.toLowerCase().includes(descriptionSearch.toLowerCase());
        const dateMatch = new Date(transaction.transactionDate).toLocaleString().includes(dateSearch);
        return amountMatch && descriptionMatch && dateMatch;
    });
};

    const handleApproveTransaction = async (transactionId: string) => {
        const success = await accountsProvider.approveJournalEntry(transactionId);

        if (success) {
            //refetch unapproved transactions
            updateTransactions();
        } else {
            alert('Failed to approve transaction');
        }
    }

    const handleRejectTransaction = async (transactionId: string) => {
        // show modal
        setupSelectedTransaction(transactionId);
        setIsModalOpen(true);
    }

    const setupSelectedTransaction = (transactionId: string) => {
        setActiveTransaction(transactionId);
    }

    useEffect(() => {
        //fetch unapproved transactions
        const fetchUnapprovedTransactions = async () => {
            const transactions = await accountsProvider.getUnapprovedTransactions(account.accountId);
            setUnaprovedTransactions(transactions);
        }

        fetchUnapprovedTransactions();
        
    }, []);

    useEffect(() => {
        //fetch unapproved transactions
        const fetchUnapprovedTransactions = async () => {
            const transactions = await accountsProvider.getUnapprovedTransactions(account.accountId);
            setUnaprovedTransactions(transactions);
        }

        fetchUnapprovedTransactions();
        
    }, [forceRefresh]);

    const removeJournalEntry = async (transactionId: string) => {
        //refetch unapproved transactions
        updateTransactions();
    }

    const creatNewJournalEntryModalClose = (success: boolean) => {
        setIsCreateJournalEntryModalOpen(false);
        if (success) {
            updateTransactions();
        }
    }

    const showJournalEntryPostReferenceModal = (transaction: UnapprovedJournalEntry) => {
        setSelectedJournalEntry(transaction);
        setIsViewModalOpen(true);
    };

    useEffect(() => {
        if (auth.isAdmin || auth.isManager) {
            setCanReject(true);
        }
    }, [auth.isAdmin, auth.isManager]);

    return (
        <>
            <JournalEntryPostReferenceModal journalEntry={selectedJournalEntry} isOpen={isViewModalOpen} onClose={setIsViewModalOpen} />
            <CreateJournalEntryModal account={account} isOpen={isCreateJournalEntryModalOpen} onClose={creatNewJournalEntryModalClose}/>
            <JournalEntryRejectionModal journalEntry={activeTransaction || ""} isOpen={isModalOpen} onClose={setIsModalOpen} successfullRejection={removeJournalEntry}/>
            <div className="flex flex-col h-full">

                <div className='flex flex-row justify-evenly w-full gap-4 pl-4 pr-4'>
                    <input type="text" placeholder="Search by amount" value={amountSearch} onChange={(e) => setAmountSearch(e.target.value)} />
                    <input type="text" placeholder="Search by description" value={descriptionSearch} onChange={(e) => setDescriptionSearch(e.target.value)} />
                    <input type="text" placeholder="Search by date" value={dateSearch} onChange={(e) => setDateSearch(e.target.value)} />
                </div>
                
                <table className="accounts-table mt-4">
                    <thead>
                        <tr>
                            <th>Date</th>
                            {/* <th>Amount</th> */}
                            <th>Total Amount</th>
                            <th>Description</th>
                            <th>Approve</th>
                            <th>Adjustment</th>
                            <th>PR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterTransactions(unapprovedTransactions).map((transaction) => (
                                <tr 
                                    key={transaction.transactionId} 
                                    className={activeTransaction === transaction.transactionId ? 'active-user-row' : ''}
                                >
                                <td>{new Date(transaction.transactionDate).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                                <td>{formatCurrencyString(transaction.totalAmount)}</td>
                                <td>{transaction.transactionDescription}</td>
                                <td>
                                    <div className='flex flex-row gap-1'>
                                        <button className='icon-button gap-2' style={{backgroundColor: "red"}} onClick={() => handleRejectTransaction(transaction.transactionId || '')}>
                                            <FontAwesomeIcon icon={faTimes} size="lg"/>
                                            <p>Reject</p>
                                        </button>
                                        <button className='icon-button gap-2' style={{backgroundColor: "green"}} onClick={() => handleApproveTransaction(transaction.transactionId || '')}>
                                            <FontAwesomeIcon icon={faCheck} size='lg'/>
                                            <p>Approve</p>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                   {transaction.isAdjustingEntry ? 'Yes' : 'No'}
                                </td>
                                <td>
                                    <button onClick={() => showJournalEntryPostReferenceModal(transaction)} className='icon-button'>
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='mt-auto w-full flex flex-row justify-center p-1'>
                    <button className='icon-button' onClick={() => setIsCreateJournalEntryModalOpen(true)}>
                        <div className='flex flex-row gap-2 items-center'>
                            <p>Create Journal Entry</p>
                        </div>
                    </button>
                    {/* <CreateNewTransactionBar account={account} onCreate={(value, description) => handleCreateTransaction(value, description)} /> */}
                </div>
            </div>
        </>
    );
};

export default UnapprovedTransactionsTable;