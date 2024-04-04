import React from 'react';
import './AccountsComponents.css'
import TransactionsModal from './Modals/TransactionsModal';
import { Account } from '../interfaces/Accounts';
import { Tooltip } from '@mui/material';

interface TransactionsButtonProps {
    account: Account;
    needsRefresh: () => void;
}

const TransactionsButton: React.FC<TransactionsButtonProps> = ({account, needsRefresh}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    // use your props here
    const showModal = () => {
        setIsOpen(true);
    }
    const hideModal = (hasChanges: boolean) => {
        setIsOpen(false);

        if (hasChanges) {
            // Refresh the transactions list
            needsRefresh();
        }
    }

    return (
       <div>
            <TransactionsModal account={account} isOpen={isOpen} onClose={hideModal} />
            <div className='transactions-button'>
                <Tooltip title='View All Transactions'>
                <button onClick={showModal}>
                    Transactions
                </button>
                </Tooltip>
            </div>
       </div>
    );
};

export default TransactionsButton;