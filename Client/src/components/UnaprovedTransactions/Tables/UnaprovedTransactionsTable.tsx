// UserTable.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Account, AccountTransaction, UnapprovedTransaction } from '../../interfaces/Accounts';
import { useAuth } from '../../../Providers/AuthProvider';
import TransactionRejectionModal from '../../accounts/Modals/TransactionRejcetionModal';
import { useAccounts } from '../../../Providers/AccountsProvider';
import CreateNewTransactionBar from '../../accounts/CreateNewTransactionBar';
import { PostNewUnapprovedTransaction } from '../../../services/AccountsService';


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
            <div className=" p-6">
                
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
                                <td>{transaction.transactionDescription}</td>
                                {/* <td>
                                    <div className='flex flex-row justify-center content-center items-center'>
                                    {!transaction.rejected && 
                                        <p className='mr-4' style={{color: transaction.isApproved ? 'green' : 'red'}}>
                                            {transaction.isApproved ? 'Approved' : 'No'}
                                        </p>
                                    }
                                        {transaction.rejected ? 
                                            <div className='flex flex-row items-center gap-2'>
                                                <strong style={{color: 'red'}}>REJECTED</strong>
                                            <button className='icon-button' style={{backgroundColor: '#ff8c00'}} onClick={() => handleViewTransactionRejection(transaction.transactionId || '')}>
                                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size='xs'/>
                                            </button>
                                            </div> :
                                            !transaction.isApproved && canReject && (
                                                <div className='flex flex-row gap-1'>
                                                    <button className='icon-button' style={{backgroundColor: "red"}} onClick={() => handleRejectTransaction(transaction.transactionId || '')}>
                                                        <FontAwesomeIcon icon={faTimes} size="xs"/>
                                                    </button>
                                                    <button className='icon-button' style={{backgroundColor: "green"}} onClick={() => handleApproveTransaction(transaction.transactionId || '')}>
                                                        <FontAwesomeIcon icon={faCheck} size='xs'/>
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                </td> */}
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