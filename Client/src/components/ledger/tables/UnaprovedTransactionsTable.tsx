// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction, UnapprovedTransaction } from '../../interfaces/Accounts';
import { useAuth } from '../../../Providers/AuthProvider';
import TransactionRejectionModal from '../../accounts/Modals/TransactionRejcetionModal';
import { useAccounts } from '../../../Providers/AccountsProvider';
import CreateNewTransactionBar from '../../accounts/CreateNewTransactionBar';
import { PostNewUnapprovedTransaction } from '../../../services/AccountsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


export interface UnaprovedTransactionsTableProps {
    account: Account;
}

const UnapprovedTransactionsTable: React.FC<UnaprovedTransactionsTableProps> = ({ account}) => {
    const auth = useAuth();
    const accountsProvider = useAccounts();
    const [canReject, setCanReject] = useState<boolean>(false);
    const [unaprovedTransactions, setUnaprovedTransactions] = useState<UnapprovedTransaction[]>([]);
    const [activeTransaction, setActiveTransaction] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<AccountTransaction>({} as AccountTransaction);
    


    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const handleApproveTransaction = async (transactionId: string) => {
        // Call the approve transaction function from the accounts provider
    }

    const handleRejectTransaction = async (transactionId: string) => {
        // show modal
        let transaction = unaprovedTransactions.find((transaction) => transaction.transactionId === transactionId);
        setSelectedTransaction(transaction as UnapprovedTransaction);
        setIsModalOpen(true);
    }

    useEffect(() => {
        //fetch unapproved transactions
        const fetchUnapprovedTransactions = async () => {
            const transactions = await accountsProvider.getUnapprovedTransactions(account.accountId);
            setUnaprovedTransactions(transactions);
        }

        fetchUnapprovedTransactions();
        
    }, []);

    const handleCreateTransaction = async (value: number, description: string) => {
        const newTransaction = await accountsProvider.createUnapprovedTransaction(account.accountId, value, description);

        // if new transaction is null/empty then alert the user
        if (!newTransaction) {
            alert('Failed to create new transaction');
            return;
        }

        // Add the new transaction to the transactions list
        setUnaprovedTransactions([...unaprovedTransactions, newTransaction]);
    };

    useEffect(() => {
        if (auth.isAdmin || auth.isManager) {
            setCanReject(true);
        }
    }, [auth.isAdmin, auth.isManager]);

    return (
        <>
            <TransactionRejectionModal transaction={selectedTransaction} isOpen={isModalOpen} onClose={setIsModalOpen} />
            <div className="flex flex-col justify-between h-full">
                
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Approve</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unaprovedTransactions.map((transaction) => (
                                <tr 
                                    key={transaction.transactionId} 
                                    className={activeTransaction === transaction.transactionId ? 'active-user-row' : ''}
                                >
                                <td>{new Date(transaction.transactionDate).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                                <td>{formatCurrencyString(transaction.transactionAmount)}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
                <CreateNewTransactionBar account={account} onCreate={(value, description) => handleCreateTransaction(value, description)} />
            </div>
        </>
    );
};

export default UnapprovedTransactionsTable;