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
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Date</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                {accountLogs.map((log, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td>{log.action}</td>
                            <td>{new Date(log.date).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
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
                                <td colSpan={3}>
                                    {/* Render your dropdown or expanded content here */}
                                    Detailed information for log {log.logId}
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
