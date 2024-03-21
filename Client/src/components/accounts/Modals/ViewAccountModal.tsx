import React, { useState, useEffect } from 'react';
import { Account, AccountLogs, AccountTransaction } from '../../interfaces/Accounts';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import ModalBody from '../../Modal/ModalBody';
import ReadOnlyAccountInfo from '../ReadOnlyAccountInfo';
import TransactionsTable from '../Table/TransactionsTable';
import { useAccounts } from '../../../Providers/AccountsProvider';
import '../AccountsComponents.css';
import AccountLogsTable from '../Table/AccountLogsTable';

interface ViewAccountModalProps {
    account: Account;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

const ViewAccountModal: React.FC<ViewAccountModalProps> = ({account, isOpen, onClose }) => {
    if (!isOpen) return null;

    const accountsProvider = useAccounts();
    const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
    const [accountLogs, setAccountLogs] = useState<AccountLogs[]>([]);
   
    useEffect(() => {
        const fetchInfo = async () => {
            const transactions = await accountsProvider.getAccountTransactions(account.accountId);
            setTransactions(transactions);

            const logs = await accountsProvider.fetchAccountLogs(account.accountId);
            setAccountLogs(logs);
        }

        //    if (isOpen) fetchInfo();
        fetchInfo();
    }, []);

    const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
    };
    

  return (
    <div className="modal-backdrop" onClick={() => onClose(false)}>
      <div className="view-account-modal-content" onClick={handleModalClick}>
        <ModalHeader mainText={account.accountName} subText={account.accountNumber.toString()} />
        <ModalBody styles={{ padding: 0 }}>
            <div className='w-full flex flex-row gap-4 justify-center content-center'>
                <div className='p-6'>
                    <ReadOnlyAccountInfo account={account} />
                </div>
                <div className='vertical-divider'></div>
                <div className='h-full'>
                    { transactions.length > 0 ? (
                        <TransactionsTable account={account} transactions={transactions} />
                    ) : ( 
                        <p>There are no transactions for this account</p>
                    )}
                </div>
                <div className='vertical-divider'></div>
                <div className='p-6'>
                    { accountLogs.length > 0 ? (
                        <>
                            <AccountLogsTable accountLogs={accountLogs} />
                        </>
                    ) : (
                        <p>There are no logs for this account</p>
                    )}
                </div>
            </div>
        </ModalBody>
        <ModalFooter hideCancel={true} onActionCancel={() => onClose(false)} onActionComplete={() => onClose(false)} />
      </div>
    </div>
  );
};

export default  ViewAccountModal;
