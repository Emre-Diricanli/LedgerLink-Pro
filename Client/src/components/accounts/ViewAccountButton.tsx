import React from 'react';
import './AccountsComponents.css'
import { Account } from '../interfaces/Accounts';
import ViewAccountModal from './Modals/ViewAccountModal';
import { Tooltip } from '@mui/material';

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
       <div>
            <ViewAccountModal account={account} isOpen={isOpen} onClose={hideModal} />
            <div className='view-account-button'>
                <Tooltip title='View Your Account'>
                <button onClick={showModal} title='View Account'>
                    View
                </button>
                </Tooltip>
            </div>
       </div>
    );
};

export default ViewAccountButton;