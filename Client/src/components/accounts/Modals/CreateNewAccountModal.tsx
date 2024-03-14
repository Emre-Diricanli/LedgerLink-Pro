import React, { useState, useEffect } from 'react';
import { NewAccount } from '../../interfaces/Accounts';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import ModalBody from '../../Modal/ModalBody';
import { useAccounts } from '../../../Providers/AccountsProvider';

interface CreateNewAccountModalProps {
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

const  CreateNewAccountModal: React.FC<CreateNewAccountModalProps> = ({isOpen, onClose }) => {
    const [newAccount, setNewAccount] = useState<NewAccount>({} as NewAccount);
    const [selectedCategory, setSelectedCategory] = useState<string>('Asset');
    const accountsProvider = useAccounts();


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewAccount(prevState => ({ ...prevState, [name]: value }));
        if (name === 'Category') {
            console.log('Category changed: ' + value);
            setSelectedCategory(value);
        }
    };
    
    const handleCreateNewAccount = async () => {
        //Create new account
        newAccount.Category = selectedCategory;
        const createNewAccountResponse = await accountsProvider.createNewAccount(newAccount);

        //If account was created successfully, close the modal
        if (createNewAccountResponse){
            onClose(true);
        } else {
            //Display error message
            alert('An error occurred while creating the new account');
        }
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
                <input type="text" name="AccountName" placeholder='Account Name' value={newAccount.AccountName} maxLength={50} onChange={handleInputChange}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Account Number<strong>*</strong></p>
                <input type="number" name="AccountNumber" placeholder='Account Number' value={newAccount.AccountNumber} maxLength={10} onChange={handleInputChange}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full">
                <p>Description<strong>*</strong></p>
                <textarea placeholder="Description"  name="Description" maxLength={250} value={newAccount.Description} onChange={handleInputChange} />
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Category<strong>*</strong></p>
                <select name="Category" value={selectedCategory} onChange={handleInputChange}>
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expenses">Expenses</option>
                </select>

            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Sub-Category<strong>*</strong></p>
                <input type="text" name="Subcategory" placeholder='Sub-Category' maxLength={50} value={newAccount.Subcategory} onChange={handleInputChange}/>
            </div>
            {/* <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Normal side<strong>*</strong></p>
                <select>
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                </select>
            </div> */}
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Initial Balance<strong>*</strong></p>
                <input type="number" name="InitialBalance" placeholder='Initial Balance' maxLength={10} value={newAccount.InitialBalance} onChange={handleInputChange}/>
            </div>
            {/* <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Statement<strong>*</strong></p>
                <select>
                    <option value="BS">Balance Sheet</option>
                    <option value="IS">Income Statement</option>
                    <option value="RE">Retained Earnings</option>
                </select>
            </div> */}
            {/* <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Order<strong>*</strong></p>
                <div className='secondary'>
                    <p>Leave at zero to ignore order</p>
                </div>
                <input type="text" placeholder='Order' maxLength={10} defaultValue={0}/>
            </div> */}
            {/* <div className="flex flex-col content-center justify-start gap-0 w-full">
                <p>Comments</p>
                <textarea placeholder="Comments" maxLength={150} />
            </div> */}
        </ModalBody>
        <ModalFooter completetext='Create' onActionCancel={() => onClose(false)} onActionComplete={() => handleCreateNewAccount()} />
      </div>
    </div>
  );
};

export default  CreateNewAccountModal;
