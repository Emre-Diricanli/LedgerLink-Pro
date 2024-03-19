import React, { useState, useEffect } from 'react';
import '../create-new-user/CreateNewUserModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowsRotate, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AdminCreateUserAccessExpirations } from '../../services/UserService';
import { useSystems } from '../../Providers/SystemsProvider';

interface CreateUserAccessExpirationModalProps {
  userId: string;
  isOpen: boolean;
  onClose: (arg0: boolean) => void;
}

const CreateUserAccecssExpirationModal: React.FC<CreateUserAccessExpirationModalProps> = ({ userId, isOpen, onClose }) => {
    if (!isOpen) return null;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const systemsProvider = useSystems();

    const [creatingNewAccessExpiration, setCreatingNewAccessExpiration] = useState(false);

    useEffect(() => {
        const today = new Date();
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
        setStartDate(formatDate(today));
        setEndDate(formatDate(thirtyDaysLater));
      }, []);

      const handleCreateNewAccessExpiration = async () => {
        //ensure the start date is before the end date
        if (new Date(startDate) >= new Date(endDate)) {
            alert('Start date must be before end date');
            return;
        }

        const response = await AdminCreateUserAccessExpirations(userId, startDate, endDate, reason, systemsProvider.apiUrl);

        if (response === true) {
            onClose(true);
        } else {
            alert('Failed to create new access expiration. Please try again.');
        }
      };

const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
    };
    

  return (
    <div className="modal-backdrop" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={handleModalClick}>
      <div className="flex flex-row items-center justify-start gap-2 w-full pb-2">
            <h2>Create New Access Expiration</h2>
        </div>
        <div className="flex flex-row gap-2 content-center justify-start w-full pt-4">
          <div className="flex flex-col content-center justify-start gap-0 w-full ">
            <p>Start Date<strong>*</strong></p>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col content-center justify-start gap-0 w-full ">
            <p>End Date<strong>*</strong></p>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
            <p>Reason</p>
            <input type="text" placeholder="Reason" className="modal-content-input" onChange={(e) => setReason(e.target.value)} maxLength={100}/>
        </div>
        <div className="flex flex-row content-center justify-center gap-2 w-full pt-14">
            {creatingNewAccessExpiration ? (
                <FontAwesomeIcon icon={faArrowsRotate} className='icon-spinning' size='lg'/>
            ) : (
                <button className="modal-content-btn" onClick={handleCreateNewAccessExpiration}>Create</button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CreateUserAccecssExpirationModal;
