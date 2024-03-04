import React from 'react';
import AccountsSummary from './AccountsSummary';
import ActionDropdown from '../ActionsDropdown/ActionsDropdown';

interface AccountsTableProps {
    // define your props here
}

const AccountsTable: React.FC<AccountsTableProps> = (props) => {
    return (
        <div className='w-full flex flex-col'>
            <AccountsSummary NumAccounts={25} TotalAssets={100000} />
            <div className='w-full flex flex-col items-center p-8'>
            <table>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                />
                            </th>
                            <th style={{minWidth: "200px"}}>Account Number</th>
                            <th style={{minWidth: "200px"}}>Account Name</th>
                            <th style={{minWidth: "200px"}}>Category</th>
                            <th style={{minWidth: "200px"}}>Sub Category</th>
                            <th style={{minWidth: "200px"}}>Balance</th>
                            <th style={{minWidth: "200px"}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="checkbox"
                                />
                            </td>
                            <td>123456</td>
                            <td>John Doe</td>
                            <td>Savings</td>
                            <td>Emergency Fund</td>
                            <td>$10,000</td>
                            <td>
                                <ActionDropdown 
                                    actionOptions={[]} />
                            </td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </div>
    );
}

export default AccountsTable;