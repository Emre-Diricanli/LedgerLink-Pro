import React from 'react';
import './Modal.css'

interface ModalHeaderProps {
    mainText: string;
    subText: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ mainText, subText }) => {
    return (
        <div className="modal-header">
            <h3>{mainText}</h3>
            <p>{subText}</p>
        </div>
    );
}

export default ModalHeader;