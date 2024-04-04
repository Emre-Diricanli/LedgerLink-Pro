import React, { useEffect, useState } from 'react';
import { Account, AccountLogs, AccountTransaction } from '../../components/interfaces/Accounts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAccounts } from '../../Providers/AccountsProvider';
import TransactionsTable from '../../components/accounts/Table/TransactionsTable';
import AccountLogsTable from '../../components/accounts/Table/AccountLogsTable';
import CreateNewTransactionBar from '../../components/accounts/CreateNewTransactionBar';
import UnapprovedTransactionsTable from '../../components/UnaprovedTransactions/Tables/UnaprovedTransactionsTable';

interface LedgerProps {
    // define your props here
    account: Account;
    hideLedger: () => void;
}

const Ledger: React.FC<LedgerProps> = ({account, hideLedger}) => {
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

    const handleCreateTransaction = async (transaction: AccountTransaction) => {
        const newTransaction = await accountsProvider.createAccountTransaction(transaction);

        // Add the new transaction to the transactions list
        setTransactions([...transactions, newTransaction]);
    };


    return (
        <div className='flex flex-col w-full h-full p-4'>
            <div className='flex flex-row w-full justify-between'>
                <button className='icon-button' onClick={hideLedger}>
                    <div className='flex flex-row gap-2 items-center'>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} flip='horizontal'/>
                        <p>Back</p>
                    </div>
                </button>
                <h2 className='ml-auto mr-auto'>{account.accountName}</h2>
            </div>
            <div className='flex flex-row w-full h-full gap-0'>
                <div className='flex flex-col w-full'>
                    { transactions.length > 0 ? (
                            <TransactionsTable account={account} transactions={transactions} />
                    ) : ( 
                        <p>There are no transactions for this account</p>
                    )}
                    {/* <div >
                        <CreateNewTransactionBar account={account} onCreate={handleCreateTransaction} />
                    </div> */}
                </div>
                <div className='vertical-divider'></div>
                <div className='flex flex-col w-full '>
                    {/* { accountLogs.length > 0 ? (
                    <>
                        <AccountLogsTable accountLogs={accountLogs} />
                    </>
                    ) : (
                        <p>There are no logs for this account</p>
                    )} */}
                    
                    <UnapprovedTransactionsTable account={account} />
                   
                </div>
            </div>
        </div>
    );
};

export default Ledger;