import React, { useState, useEffect } from 'react';
// import '../create-new-user/CreateNewUserModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Account } from '../../interfaces/Accounts';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import ModalBody from '../../Modal/ModalBody';

interface EditAccountModalProps {
    account: Account;
    isOpen: boolean;
    onClose: (arg0: boolean, arg1: Account) => void;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ account: account, isOpen, onClose }) => {

    const [newAccount, setNewAccount] = useState<Account>(account);

    // const [roleOptions, setRoleOptions] = useState<string[]>([]);
    // const roleMapping = {
    //     'Admin': 'Admin',
    //     'Manager': 'Manager',
    //     'User': 'User',
    // }

    const revertChanges = () => {
        setNewAccount(account);
    };

    const handleUpdateAccount = async () => {
        onClose(true, newAccount);
    }

    const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
    };
    
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => onClose(false, account)}>
      <div className="modal-content" onClick={handleModalClick}>
        <ModalHeader mainText={`Edit ${newAccount.AccountName}`} subText={newAccount.AccountNumber.toString()} />
        <ModalBody>
            <div className="flex flex-row items-center justify-start gap-2 w-full pb-2">
                <h2>Edit {newAccount.AccountName}</h2>
                <p>{newAccount.AccountNumber}</p>
            </div>
            <div className="flex flex-row gap-2 content-center justify-start w-full pt-4">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="firstName">Account</label>
                    <input type="text" id="firstName" name="firstName" value={newAccount.AccountName} onChange={(e) => setNewAccount({ ...newAccount, AccountName: e.target.value })} />
                </div>
            </div>
            
            <div className="flex flex-row items-center justify-center gap-2 w-full mt-8">
                <span className="flex-grow-0">
                    <button className="icon-button redo-button" onClick={() => revertChanges()}>
                        <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                </span>
            </div>
        </ModalBody>
        <ModalFooter completetext='Update' onActionCancel={() => onClose(false, newAccount)} onActionComplete={() => handleUpdateAccount()} />
        
        
      </div>
    </div>
  );
};

export default EditAccountModal;
