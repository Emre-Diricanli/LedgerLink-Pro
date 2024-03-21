import React, { useEffect, useState } from 'react';
import './AccountsComponents.css';
import { Account } from '../interfaces/Accounts';

export interface SelectedAccountInfoProps {
    selectedAccount: Account;
  }

const SelectedAccountInfo: React.FC<SelectedAccountInfoProps> = ({ selectedAccount }) => {
 
    return (
        <div>
            <div className='selected-account-info-container'>
                <div className='p-6'>
                    <h1>{selectedAccount.accountName}</h1>
                </div>
                <div className='section-divider'></div>
                <div className='p-6'>
                    <h2 className=''>{selectedAccount.category}</h2>
                    <h3 className=''>{selectedAccount.subcategory}</h3>
                </div>
            </div>
        </div>
    );
};

export default SelectedAccountInfo;
