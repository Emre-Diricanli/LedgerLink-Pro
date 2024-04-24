import React, { useEffect, useState } from 'react';
import UnapprovedTransactionsTable from '../ledger/tables/UnaprovedTransactionsTable';
import { useAccounts } from '../../Providers/AccountsProvider';
import { DashboardQuickInfo } from '../interfaces/Dashboard';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DashboardNotificationsProps {
    // define your props here
}

const DashboardNotifications: React.FC<DashboardNotificationsProps> = (props) => {
    const accountsProvider = useAccounts();

    const [dashboardQuickStats, setDashboardQuickStats] = useState<DashboardQuickInfo>( {} as DashboardQuickInfo);


    useEffect(() => {
        const fetchDashboardQuickStats = async () => {
            const quickStats = await accountsProvider.getDashboardQuickStats();

            if (quickStats) {
                setDashboardQuickStats(quickStats);
            }
        };

        fetchDashboardQuickStats();
    }, []);

    const navigateToAccounts = () => {
        // navigate to accounts page
        window.location.href = '/accounts';
    };


    return (
        <div className='flex-col flex w-1/3  h-full p-4'>
            <div className='flex flex-col w-full h-full'>
                <div className='flex flex-row gap-3 items-start justify-start content-start'>
                    <h3>Unapproved Journal Entries</h3>
                    <button className='icon-button' onClick={navigateToAccounts}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </button>
                </div>
                <div className='horizontal-divider mt-2'></div>
                {dashboardQuickStats.unapprovedJournalEntries && dashboardQuickStats.unapprovedJournalEntries.length > 0 ? (
                    <table className='mt-4'>
                        <thead>
                            <tr>
                                <th>Account Name</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardQuickStats.unapprovedJournalEntries.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.accountName}</td>
                                    <td>{transaction.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='mt-4'>No Unapproved Journal Entries</p>
                )}
            </div>
            <div className='flex flex-col w-full h-full'>
                <h3>Errors</h3>
                <div className='horizontal-divider'></div>
                {dashboardQuickStats.errorLogs && dashboardQuickStats.errorLogs.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Method Name</th>
                                <th>Error Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardQuickStats.errorLogs.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.errorType}</td>
                                    <td>{transaction.errorCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='mt-4'>No errors to display</p>
                )}
            </div>
        </div>
    );
}

export default DashboardNotifications;