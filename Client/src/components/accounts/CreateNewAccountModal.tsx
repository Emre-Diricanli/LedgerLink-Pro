import React, { useState, useEffect } from 'react';
import '../create-new-user/CreateNewUserModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { admin_create_user_access_expiration } from '../../services/user_info_service';
import { Account } from '../interfaces/Accounts';
import ModalFooter from '../Modal/ModalFooter';
import ModalHeader from '../Modal/ModalHeader';
import ModalBody from '../Modal/ModalBody';

interface CreateNewAccountModalProps {
    isOpen: boolean;
    onClose: (boolean) => void;
}

const  CreateNewAccountModal: React.FC<CreateNewAccountModalProps> = ({isOpen, onClose }) => {

    const [newUser, setNewUser] = useState<Account>();

    const handleCreateNewAccount = async () => {
    };

    const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
    };
    
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={handleModalClick}>
        <ModalHeader mainText='Create New Account' subText='Create a new account' />
        <ModalBody > 
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Account Name<strong>*</strong></p>
                <input type="text" placeholder='Account Name' maxLength={50}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Account Number<strong>*</strong></p>
                <input type="text" placeholder='Account Number' maxLength={10}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full">
                <p>Description<strong>*</strong></p>
                <textarea placeholder="Description" maxLength={250} />
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Category<strong>*</strong></p>
                <select>
                    <option value="Savings">Asset</option>
                    <option value="Checking">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expenses">Expenses</option>
                    
                </select>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Sub-Category<strong>*</strong></p>
                <input type="text" placeholder='Sub-Category' maxLength={50}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Normal side<strong>*</strong></p>
                <select>
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                </select>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Initial Balance<strong>*</strong></p>
                <input type="text" placeholder='Initial Balance' maxLength={10}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Statement<strong>*</strong></p>
                <select>
                    <option value="BS">Balance Sheet</option>
                    <option value="IS">Income Statement</option>
                    <option value="RE">Retained Earnings</option>
                </select>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Order<strong>*</strong></p>
                <div className='secondary'>
                    <p>Leave at zero to ignore order</p>
                </div>
                <input type="text" placeholder='Order' maxLength={10} defaultValue={0}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full">
                <p>Comments</p>
                <textarea placeholder="Comments" maxLength={150} />
            </div>
        </ModalBody>
        <ModalFooter completetext='Create' onActionCancel={() => onClose(false)} onActionComplete={() => handleCreateNewAccount()} />
      </div>
    </div>
  );
};

export default  CreateNewAccountModal;
