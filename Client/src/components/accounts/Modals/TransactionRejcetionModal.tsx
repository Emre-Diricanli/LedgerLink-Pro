import React, { useState, useEffect } from 'react';
import ModalBody from '../../Modal/ModalBody';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import { useSystems } from '../../../Providers/SystemsProvider';
import { AccountTransaction } from '../../interfaces/Accounts';
import { SendAccountRejection } from '../../../services/AccountsService';

interface TransactionRejectionModalProps {
    transaction: AccountTransaction;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}


const TransactionRejectionModal: React.FC<TransactionRejectionModalProps> = ({transaction, isOpen, onClose }) => {
    if (!isOpen) return null;

    const systems = useSystems();
    const [rejectionDescription, setRejectionDescription] = useState<string>('');

    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
    };

    const handleSubmitRejections = async () => {
        //if description is empty then alert user
        if (rejectionDescription === '') {
            alert('Please provide a description for the rejection');
            return;
        }

        //send rejection to backend
        if (transaction.transactionId !== undefined) {
            console.log('sending rejection');
            const success = await SendAccountRejection(transaction.transactionId, rejectionDescription, systems.apiUrl);

            if (!success) {
                alert('Failed to reject transaction');
                return;
            }
        }

        //if successful then close modal
        onClose(false);
    };

    return (
        <div className="modal-backdrop" onClick={() => onClose(false)}>
            <div className="view-account-modal-content" onClick={handleModalClick}>
                <ModalHeader mainText="Reject Transaction" subText={transaction.transactionDescription} />
                    <ModalBody styles={{ padding: 0 }}>
                       <div className='flex flex-col p-8 gap-8'>
                        <h4>To reject this transaction please write a short description explaining why.</h4>
                            <div className='flex flex-col gap-0'>
                                <p>Description</p>
                            <textarea
                                className=""
                                value={rejectionDescription}
                                onChange={(e) => setRejectionDescription(e.target.value)} />
                            </div>
                       </div>
                    </ModalBody>
                <ModalFooter onActionCancel={() => onClose(false)} onActionComplete={() => handleSubmitRejections()} completeText='Reject'/>
            </div>
        </div>
    );
};

export default TransactionRejectionModal;