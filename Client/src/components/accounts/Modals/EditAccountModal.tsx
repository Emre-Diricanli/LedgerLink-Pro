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
    if (!isOpen) return null;

    const [accountName, setAccountName] = useState<string>(account.accountName);
    const [accountNumber, setAccountNumber] = useState<number>(account.accountNumber);
    const [description, setDescription] = useState<string>(account.description);
    const [category, setCategory] = useState<string>(account.category);
    const [subcategory, setSubcategory] = useState<string>(account.subcategory);

    const [selectedCategory, setSelectedCategory] = useState<string>('Asset');

    // const [roleOptions, setRoleOptions] = useState<string[]>([]);
    // const roleMapping = {
    //     'Admin': 'Admin',
    //     'Manager': 'Manager',
    //     'User': 'User',
    // }

    const revertChanges = () => {
        setAccountName(account.accountName);
        setAccountNumber(account.accountNumber);
        setDescription(account.description);
        setCategory(account.category);
        setSubcategory(account.subcategory);
    };

    // update the selected account
    const handleUpdateAccount = async () => {
        const newAccount  = account;
        newAccount.accountName = accountName;
        newAccount.accountNumber = accountNumber;
        newAccount.description = description;
        newAccount.category = category;
        newAccount.subcategory = subcategory;

        onClose(true, newAccount);
    }

    const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the backdrop
    };
    

  return (
    <div className="modal-backdrop" onClick={() => onClose(false, account)}>
      <div className="modal-content" onClick={handleModalClick}>
        <ModalHeader mainText={`Edit ${account.accountName}`} subText={`[${account.accountNumber.toString()}]`} />
        <ModalBody>
            <div className="flex flex-row gap-2 content-center justify-start w-full">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="firstName">Account</label>
                    <input type="text" id="firstName" name="firstName" value={accountName}  onChange={(e) => setAccountName(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Account Number<strong>*</strong></p>
                <input type="number" name="AccountNumber" placeholder='Account Number' value={accountNumber} maxLength={10} onChange={(e) => setAccountNumber(parseInt(e.target.value))}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full">
                <p>Description<strong>*</strong></p>
                <textarea placeholder="Description"  name="Description" maxLength={250} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Category<strong>*</strong></p>
                <select name="Category" value={selectedCategory} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expenses">Expense</option>
                </select>
            </div>
            
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Sub-Category<strong>*</strong></p>
                <input type="text" name="Subcategory" placeholder='Sub-Category' maxLength={50} value={subcategory} onChange={(e) => setSubcategory(e.target.value)}/>
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
        <ModalFooter completeText='Update' onActionCancel={() => onClose(false, account)} onActionComplete={() => handleUpdateAccount()} />
        
        
      </div>
    </div>
  );
};

export default EditAccountModal;
