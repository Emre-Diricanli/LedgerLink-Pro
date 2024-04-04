import React, { useState, useEffect } from 'react';
import ModalBody from '../../Modal/ModalBody';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import { useSystems } from '../../../Providers/SystemsProvider';
import { AccountTransaction } from '../../interfaces/Accounts';
import { RejectJournalEntry } from '../../../services/AccountsService';

interface ViewTransactionRejectionModalProps {
    transaction: AccountTransaction;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}


const ViewTransactionRejectionModal: React.FC<ViewTransactionRejectionModalProps> = ({transaction, isOpen, onClose }) => {
    if (!isOpen) return null;


    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
    };

    
    return (
        <div className="modal-backdrop" onClick={() => onClose(false)}>
            <div className="view-account-modal-content" onClick={handleModalClick}>
                <ModalHeader mainText="Transaction Rejected" subText={transaction.transactionDescription} />
                    <ModalBody styles={{ padding: 0 }}>
                       <div className='flex flex-col p-8 gap-8'>
                       <p className='text-xs whitespace-pre-wrap w-fit'>
                        {JSON.stringify(transaction.rejectedAccountTransaction, null, 4)}
                       </p>
                       </div>
                    </ModalBody>
                <ModalFooter hideCancel={true} onActionComplete={() => onClose(false)} completeText='Close'/>
            </div>
        </div>
    );
};

export default ViewTransactionRejectionModal;