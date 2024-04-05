import React, { useEffect, useState } from 'react';
import { Account, AccountLogs, AccountTransaction } from '../../components/interfaces/Accounts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAccounts } from '../../Providers/AccountsProvider';
import TransactionsTable from '../../components/accounts/Table/TransactionsTable';
import AccountLogsTable from '../../components/accounts/Table/AccountLogsTable';
import CreateNewTransactionBar from '../../components/accounts/CreateNewTransactionBar';
import UnapprovedTransactionsTable from '../../components/ledger/tables/UnaprovedTransactionsTable';
import RejectedJournalEntriesTable from '../../components/ledger/tables/RejectedJournalEntries';

interface LedgerProps {
    // define your props here
    account: Account;
    hideLedger: () => void;
}

const Ledger: React.FC<LedgerProps> = ({account, hideLedger}) => {
    const accountsProvider = useAccounts();
    const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
    const [accountLogs, setAccountLogs] = useState<AccountLogs[]>([]);
    const [refreshTables, setRefreshTables] = useState<boolean>(false);

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

    useEffect(() => {
        const fetchInfo = async () => {
            const transactions = await accountsProvider.getAccountTransactions(account.accountId);

            setTransactions(transactions);

            const logs = await accountsProvider.fetchAccountLogs(account.accountId);
            setAccountLogs(logs);
        }

        fetchInfo();

    }, [refreshTables]);

    const handleCreateTransaction = async (transaction: AccountTransaction) => {
        const newTransaction = await accountsProvider.createAccountTransaction(transaction);

        // Add the new transaction to the transactions list
        setTransactions([...transactions, newTransaction]);
    };

    const refreshJournalEntries = async () => {
        setRefreshTables(!refreshTables);
    };
        


    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex flex-row w-full justify-between p-2'>
                <button className='icon-button' onClick={hideLedger}>
                    <div className='flex flex-row gap-2 items-center'>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} flip='horizontal'/>
                        <p>Back</p>
                    </div>
                </button>
                <h2 className='ml-auto mr-auto'>{account.accountName}</h2>
            </div>
            <div className='horizontal-divider'></div>
            <div className='flex flex-row w-full h-full gap-0'>
                <div className='flex flex-col w-full'>
                    <div className='p-4'>
                        <h3>Approved Journal Entries</h3>
                    </div>
                    { transactions.length > 0 ? (
                            <TransactionsTable account={account} transactions={transactions} />
                    ) : ( 
                        <p>There are no transactions for this account</p>
                    )}
                </div>
                <div className='vertical-divider'></div>
                <div className='flex flex-col w-3/4 h-full'>
                    <div className='flex flex-col h-full'>
                    <div className='p-4'>
                            <h3>Unapproved Journal Entries</h3>
                        </div>
                        <UnapprovedTransactionsTable account={account} updateJournalEntries={refreshJournalEntries} forceRefresh={refreshTables}/>
                    </div>
                    <div className='horizontal-divider'></div>
                    <div className='flex flex-col h-full'>
                        <div className='p-4'>
                            <h3>Rejected Journal Entries</h3>
                        </div>
                        <RejectedJournalEntriesTable account={account} forceRefresh={refreshTables}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ledger;