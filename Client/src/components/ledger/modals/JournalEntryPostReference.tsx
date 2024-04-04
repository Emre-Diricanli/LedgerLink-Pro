import React, { useState, useEffect } from 'react';
import ModalBody from '../../Modal/ModalBody';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import { useSystems } from '../../../Providers/SystemsProvider';
import { AccountTransaction, UnapprovedJournalEntry } from '../../interfaces/Accounts';
import { RejectJournalEntry } from '../../../services/AccountsService';

interface JournalEntryPostReferenceModal {
    journalEntry?: UnapprovedJournalEntry;
    transaction?: AccountTransaction;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}


const JournalEntryPostReferenceModal: React.FC<JournalEntryPostReferenceModal> = ({transaction,  journalEntry, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
    };

    const displayObject = transaction || journalEntry;

    return (
        <div className="modal-backdrop" onClick={() => onClose(false)}>
            <div className="view-account-modal-content" onClick={handleModalClick}>
            <ModalHeader mainText="Post Reference" subText={transaction?.transactionDescription ?? journalEntry?.transactionDescription ?? ''} />
                    <ModalBody styles={{ padding: 0 }}>
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <div className='flex flex-col p-8 gap-8' style={{ maxWidth: "500px" }}>
                                <p className='text-s whitespace-pre-wrap w-fit'>
                                    {JSON.stringify(displayObject, null, 4)}
                                </p>
                            </div>
                        </div>
                    </ModalBody>
                <ModalFooter hideCancel={true} onActionComplete={() => onClose(false)} completeText='Ok'/>
            </div>
        </div>
    );
};

export default JournalEntryPostReferenceModal;