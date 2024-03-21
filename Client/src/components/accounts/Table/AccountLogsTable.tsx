import React, { useState } from 'react';
import { AccountLogs } from '../../interfaces/Accounts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface AccountLogsTableProps {
    accountLogs: AccountLogs[];
}

const AccountLogsTable: React.FC<AccountLogsTableProps> = ({ accountLogs }) => {
    const [openRowIndex, setOpenRowIndex] = useState<null | number>(null);

    const toggleRow = (index: number) => {
        if (openRowIndex === index) {
            setOpenRowIndex(null); // Close the dropdown if the same row is clicked again
        } else {
            setOpenRowIndex(index); // Open the dropdown for the clicked row
        }
    };

    return (
        <div className='account-log-table-container'>
            <table>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Date</th>
                        <th>User</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                {accountLogs.map((log, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td>{log.action}</td>
                            <td>{new Date(log.date).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                            <td>{log.userName}</td>
                            <td>
                                <div onClick={() => toggleRow(index)}>
                                    { openRowIndex === index ? (
                                        <FontAwesomeIcon icon={faChevronDown} className={`cursor-pointer ${openRowIndex === index ? 'open' : ''}` } />
                                    ) : (
                                        <FontAwesomeIcon icon={faChevronUp} className={`cursor-pointer ${openRowIndex === index ? 'open' : ''}` } />
                                    ) }
                                </div>
                            </td>
                        </tr>
                        {openRowIndex === index && (
                            <tr>
                                <td colSpan={4}>
                                    <div className='flex flex-row'>
                                        <p><strong>User: </strong></p>
                                        <p> {log.userName}: <strong>{log.userId}</strong></p>
                                    </div>
                                    <div style={{height: `350px`}} className='w-full flex flex-row flex-grow justify-between mt-4'>
                                        <p className='text-xs whitespace-pre-wrap w-fit'>
                                            {JSON.stringify(log.accountBeforeChanges, null, 4)}
                                        </p>
                                        <div className='vertical-divider mr-8'></div>
                                        <p className='text-xs whitespace-pre-wrap w-fit'>
                                            {JSON.stringify(log.accountAfterChanges, null, 4)}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AccountLogsTable;
