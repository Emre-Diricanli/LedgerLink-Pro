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
    const [accountName, setAccountName] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<number>();
    const [description, setDescription] = useState<string>('');
    const [subcategory, setSubcategory] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Asset');
    const accountsProvider = useAccounts();
    const [initialBalanceDollars, setInitialBalanceDollars] = useState<number>();
    const [initialBalanceCents, setInitialBalanceCents] = useState<number>();
    
    const handleCreateNewAccount = async () => {
        let newAccount: NewAccount = {
            accountName: accountName,
            accountNumber: accountNumber || 0,
            description: description,
            category: selectedCategory,
            subcategory: subcategory,
            initialBalance: (initialBalanceDollars || 0) + ((initialBalanceCents || 0) / 100)
        };

        //verify that all required fields are filled
        if (newAccount.accountName === '' || newAccount.accountNumber === 0 || newAccount.description === '' || newAccount.subcategory === '' || newAccount.initialBalance === 0){
            alert('Please fill in all required fields');
            return;
        }

        console.log('Creating new account: ' + JSON.stringify(newAccount));
   
        //Call the provider to create the new account
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
                <input type="text" name="AccountName" placeholder='Account Name' value={accountName} maxLength={50} onChange={(e) => setAccountName(e.target.value)}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Account Number<strong>*</strong></p>
                <input type="number" name="AccountNumber" placeholder='Account Number' value={accountNumber || ''} onChange={(e) => setAccountNumber(Number(e.target.value))}/>
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-full">
                <p>Description<strong>*</strong></p>
                <textarea placeholder="Description"  name="Description" maxLength={250} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Category<strong>*</strong></p>
                <select name="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
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
            {/* <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Normal side<strong>*</strong></p>
                <select>
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                </select>
            </div> */}
            <div className="flex flex-col content-center justify-start gap-0 w-3/5">
                <p>Initial Balance<strong>*</strong></p>
                {/*<input type="text" name="InitialBalance" placeholder='Initial Balance' maxLength={10} value={newAccount.initialBalance} onChange={handleInputChange} pattern="^\d*(\.\d{0,2})?$"/> */}
                <div className="flex">
                <input type="number" name="InitialBalanceDollars" placeholder='Dollars' value={initialBalanceDollars || ''} onChange={(e) => setInitialBalanceDollars(Number(e.target.value))} min="0" className="w-1/2" />
                <input type="number" name="InitialBalanceCents" placeholder='Cents' value={initialBalanceCents || ''} onChange={(e) => setInitialBalanceCents(Number(e.target.value))} max="99" className="w-1/2" />
                </div>
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
        <ModalFooter completeText='Create' onActionCancel={() => onClose(false)} onActionComplete={() => handleCreateNewAccount()} />
      </div>
    </div>
  );
};

export default  CreateNewAccountModal;
