import React, { useState, useEffect } from 'react';
// import '../create-new-user/CreateNewUserModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Account, AccountTransaction } from '../../interfaces/Accounts';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import ModalBody from '../../Modal/ModalBody';
import TransactionsTable from '../Table/TransactionsTable';
import CreateNewTransactionBar from '../CreateNewTransactionBar';
import { useAccounts } from '../../../Providers/AccountsProvider';

interface TransactionsModalProps {
    account: Account;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

const TransactionsModal: React.FC<TransactionsModalProps> = ({ account: account, isOpen, onClose }) => {
    if (!isOpen) return null;
    const accountsProvider = useAccounts();
    const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    
    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            const transactions = await accountsProvider.getAccountTransactions(account.accountId);

            setTransactions(transactions);
        }

        if (isOpen) fetchTransactions();
    }, []);

    const handleCreateTransaction = async (transaction: AccountTransaction) => {
        const newTransaction = await accountsProvider.createAccountTransaction(transaction);

        // Add the new transaction to the transactions list
        setTransactions([...transactions, newTransaction]);

        setHasChanges(true);
    };

    
    

    return (
        <div className="modal-backdrop" onClick={() => onClose(hasChanges)}>
            <div className="transaction-modal-content" onClick={handleModalClick}>
                <ModalHeader mainText={`${account.accountName}: Transactions`} subText={`Account #: [${account.accountNumber.toString()}]`} />
                <ModalBody styles={{ padding: 0, gap: 0 }}>
                        <TransactionsTable account={account} onActiveTransactionChange={() => {}} transactions={transactions} />
                        <CreateNewTransactionBar account={account} onCreate={handleCreateTransaction} />
                </ModalBody>
                <ModalFooter completeText='Close' hideCancel={true} onActionComplete={() => onClose(hasChanges)}/>        
            </div>
        </div>
    );
};

export default TransactionsModal;
