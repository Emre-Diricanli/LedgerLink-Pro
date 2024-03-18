import React from 'react';
import './AccountsComponents.css'
import CurrencyInput from 'react-currency-input-field';
import { Account, AccountTransaction } from '../interfaces/Accounts';


// Define the types for your props
interface CreateNewTransactionBarProps {
    account: Account; // Replace 'any' with the type of your account
    onCreate: (transaction: AccountTransaction) => void; // Replace 'any' with the type of your transaction
}

// Define your component
const CreateNewTransactionBar: React.FC<CreateNewTransactionBarProps> = ({ account, onCreate }) => {
    // Component logic goes here
    const [description, setDescription] = React.useState<string>('');
    const [value, setValue] = React.useState<number>(0);

    const onValueChange = (value: string | undefined) => {
        if (value) {
            setValue(Number(value));
        } else {
            setValue(0);
        }
    }

    const handleCreate = () => {
        //verify that the value is not 0 and description is not empty
        if (value === 0 || description === '') {
            alert('Please enter a valid amount and description');
        }

        let transaction : AccountTransaction = {
            accountId: account.accountId,
            transactionDescription: description,
            transactionAmount: value,
            beforeTransactionBalance: account.balance,
            afterTransactionBalance: account.balance + value,
            transactionsDate: new Date(),
            userName: 'UNKNOWN'
        };

        onCreate(transaction);
    };

    return (
        <div className='flex flex-row w-full create-new-transaction-bar'>
            
            <input type="text" name="Description" placeholder='Description' value={description} maxLength={150} onChange={(e) => setDescription(e.target.value)}/>
            
            
            {/* <input type="number" name="InitialBalanceDollars" placeholder='Dollars' value={valueDollars || ''} onChange={(e) => setValueDollars(Number(e.target.value))} min="0" className='w-1/2'/> */}
            {/* <div className='h-auto flex flex-col justify-end items-end'>
                <h3 className='pt-auto'>.</h3>
            </div> */}
            {/* <input type="number" name="InitialBalanceCents" placeholder='Cents' value={valueCents || ''} onChange={(e) => setValueCents(Number(e.target.value))} max="99"  className='w-1/3'/> */}
            <CurrencyInput
                name="currency-input"
                placeholder="$1,000.00"
                decimalsLimit={2}
                prefix='$'
                onValueChange={onValueChange}
                />
            
            <button className='primary-btn' onClick={handleCreate}>
                Add
            </button>
        </div>
    );
};

export default CreateNewTransactionBar;