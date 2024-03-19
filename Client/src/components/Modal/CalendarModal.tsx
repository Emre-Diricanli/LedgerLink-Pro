import React, { useState } from 'react';
import Calendar from 'react-calendar';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import 'react-calendar/dist/Calendar.css';
import './Modal.css'

interface Props {
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

const CalendarModal: React.FC<Props> = ({isOpen, onClose }) => {
    // Component logic goes here
    const [value, onChange] = useState<Value>(new Date());

    type ValuePiece = Date | null;

    type Value = ValuePiece | [ValuePiece, ValuePiece]; 

    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
        };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={() => onClose(false)}>
            <div className="modal-content" onClick={handleModalClick}>
                <ModalHeader mainText='Calendar' subText='' />
                <ModalBody>
                    <div className='mb-auto text-gray-950'>
                        <Calendar onChange={onChange} value={value} />
                    </div>
                </ModalBody>
                <ModalFooter onActionCancel={() => onClose(false)} completeText='Close' onActionComplete={() => onClose(false)} hideCancel={true} />
            </div>
        </div>
    
    );
};

export default CalendarModal;