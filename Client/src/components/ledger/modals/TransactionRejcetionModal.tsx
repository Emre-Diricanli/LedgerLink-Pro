import React, { useState, useEffect } from 'react';
import ModalBody from '../../Modal/ModalBody';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import { useSystems } from '../../../Providers/SystemsProvider';
import { AccountTransaction, UnapprovedJournalEntry } from '../../interfaces/Accounts';
import { RejectJournalEntry } from '../../../services/AccountsService';

interface TransactionRejectionModalProps {
    journalEntry: string;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
    successfullRejection: (arg0: string) => void;
}


const JournalEntryRejectionModal: React.FC<TransactionRejectionModalProps> = ({journalEntry, isOpen, onClose, successfullRejection }) => {
    if (!isOpen) return null;

    const systems = useSystems();
    const [rejectionDescription, setRejectionDescription] = useState<string>('');

    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
    };

    const handleSubmitRejections = async () => {
        console.log("rejecting");
        //if description is empty then alert user
        if (rejectionDescription === '') {
            alert('Please provide a description for the rejection');
            return;
        }

        //log whole object

        //send rejection to backend
        if (journalEntry !== undefined) {
           
            console.log("sending");
            const success = await RejectJournalEntry(journalEntry, rejectionDescription, systems.apiUrl);

            if (!success) {
                alert('Failed to reject transaction');
                return;
            } 

            successfullRejection(journalEntry);
        }

        //if successful then close modal
        onClose(false);
    };

    return (
        <div className="modal-backdrop" onClick={() => onClose(false)}>
            <div className="view-account-modal-content" onClick={handleModalClick}>
                <ModalHeader mainText="Reject Transaction" subText={journalEntry} />
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
                <ModalFooter onActionCancel={() => onClose(false)} onActionComplete={handleSubmitRejections} completeText='Reject'/>
            </div>
        </div>
    );
};

export default JournalEntryRejectionModal;