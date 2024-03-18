import React from 'react';
import './Modal.css'

interface ModalFooterProps {
    canceltext?: string;
    completeText?: string;
    onActionCancel?: () => void;
    onActionComplete?: () => void;
    hideCancel?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ canceltext, completeText: completetext, onActionCancel, onActionComplete, hideCancel }) => {
    return (
        <div className="modal-footer">
            {!hideCancel && <button onClick={onActionCancel}>{canceltext || 'Cancel'}</button>}
            <button onClick={onActionComplete}>{completetext || 'Ok'}</button>
        </div>
    );
}

export default ModalFooter;