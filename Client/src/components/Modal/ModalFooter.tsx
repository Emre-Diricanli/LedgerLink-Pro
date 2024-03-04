import React from 'react';
import './Modal.css'

interface ModalFooterProps {
    canceltext?: string;
    completetext?: string;
    onActionCancel: () => void;
    onActionComplete: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ canceltext, completetext, onActionCancel, onActionComplete }) => {
    return (
        <div className="modal-footer">
            <button className='secondary' onClick={onActionCancel}>{canceltext || 'Cancel'}</button>
            <button onClick={onActionComplete}>{completetext || 'Ok'}</button>
        </div>
    );
}

export default ModalFooter;