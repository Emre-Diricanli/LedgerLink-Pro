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
    const [selectedCategory, setSelectedCategory] = useState<string>('Asset');

    // const [roleOptions, setRoleOptions] = useState<string[]>([]);
    // const roleMapping = {
    //     'Admin': 'Admin',
    //     'Manager': 'Manager',
    //     'User': 'User',
    // }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewAccount(prevState => ({ ...prevState, [name]: value }));
        if (name === 'Category') {
            console.log('Category changed: ' + value);
            setSelectedCategory(value);
        }
    };

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
        <ModalHeader mainText={`Edit ${newAccount.accountName}`} subText={`[${newAccount.accountNumber.toString()}]`} />
        <ModalBody>
            <div className="flex flex-row gap-2 content-center justify-start w-full">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="firstName">Account</label>
                    <input type="text" id="firstName" name="firstName" value={newAccount.accountName}  onChange={handleInputChange}/>
                </div>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Account Number<strong>*</strong></p>
                <input type="number" name="AccountNumber" placeholder='Account Number' value={newAccount.accountNumber} maxLength={10} onChange={handleInputChange}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full">
                <p>Description<strong>*</strong></p>
                <textarea placeholder="Description"  name="Description" maxLength={250} value={newAccount.description} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Category<strong>*</strong></p>
                <select name="Category" value={selectedCategory} onChange={handleInputChange}>
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expenses">Expense</option>
                </select>
            </div>
            
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Sub-Category<strong>*</strong></p>
                <input type="text" name="Subcategory" placeholder='Sub-Category' maxLength={50} value={newAccount.subcategory} onChange={handleInputChange}/>
            </div>
            
            <div className="flex flex-row items-center justify-start gap-2 w-full mt-8">
                <h3>Revert Changes</h3>
                <span className="flex-grow-0 ml-auto">
                    <button className="icon-button redo-button" onClick={() => revertChanges()}>
                        <FontAwesomeIcon icon={faRotateLeft} />
                    </button>
                </span>
            </div>
        </ModalBody>
        <ModalFooter completeText='Update' onActionCancel={() => onClose(false, newAccount)} onActionComplete={() => handleUpdateAccount()} />
        
        
      </div>
    </div>
  );
};

export default EditAccountModal;
