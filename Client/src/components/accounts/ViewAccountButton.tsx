import React from 'react';
import './AccountsComponents.css'
import TransactionsModal from './Modals/TransactionsModal';
import { Account } from '../interfaces/Accounts';

interface ViewAccountButtonProps {
    account: Account;
    needsRefresh: () => void;
}

const ViewAccountButton: React.FC<ViewAccountButtonProps> = ({account, needsRefresh}) => {
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
        <div className='view-account-button'>
            <TransactionsModal account={account} isOpen={isOpen} onClose={hideModal} />
            <button onClick={showModal}>
                View
            </button>
        </div>
    );
};

export default ViewAccountButton;