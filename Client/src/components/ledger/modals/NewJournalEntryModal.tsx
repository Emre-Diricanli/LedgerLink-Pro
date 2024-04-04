import React, { useState, useEffect } from 'react';
import ModalBody from '../../Modal/ModalBody';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import { Account, AccountTransaction } from '../../interfaces/Accounts';
import CurrencyInput from 'react-currency-input-field';
import { formatDate } from 'date-fns';
import { useAccounts } from '../../../Providers/AccountsProvider';

interface CreateJournalEntryModalProps {
    account: Account;
    isOpen: boolean;
    onClose: (arg0: boolean) => void;
}

interface Entry {
    name: string;
    value: number;
    [key: string]: string | number;
}

const CreateJournalEntryModal: React.FC<CreateJournalEntryModalProps> = ({account, isOpen, onClose }) => {
    if (!isOpen) return null;
    const accountsProvider = useAccounts();

    const [entries, setEntries] = useState<Entry[]>([{name: '', value: 0}]);
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<number>(0);

    const onValueChange = (value: string | undefined) => {
        if (value) {
            setValue(Number(value));
        } else {
            setValue(0);
        }
    }
    

    const handleModalClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent click from propagating to the backdrop
    };

    const handleEntryChange = (index: number, field: keyof Entry, value: string | number) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };


    const addEntry = () => {
        setEntries([...entries, {name: name, value: value}]);
    };

    const handleCreateNewJournalEntry = async () => {
        //convert entries to JournalEntryLineDTO
        const newEntries = entries.map((entry, index) => {
            return {
                index: index,
                amount: entry.value,
                description: entry.name
            };
        });
        const success = await accountsProvider.createNewJournalEntry(account.accountId, name, newEntries);

        console.log('Success:', success);

        if (success) {
            onClose(true);
        } else {
            alert('Failed to create journal entry');
        }
    };

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="modal-backdrop" onClick={() => onClose(false)}>
            <div className="view-account-modal-content" onClick={handleModalClick}>
                <ModalHeader mainText="Create Entry" subText={account.accountName} />
                    <ModalBody styles={{ padding: 0 }}>
                    <div className='h-full w-full p-4 flex flex-col'>
                        <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                            <p>Name<strong>*</strong></p>
                            <input type="text" placeholder="Entry Name" className="modal-content-input" onChange={(e) => setName(e.target.value)} maxLength={40}/>
                        </div>
                        <div className='h-full w-full p-4 flex flex-col'>
                            <div className="flex flex-row content-center items-center justify-center gap-4 w-full pt-8">
                            <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                                <p>Name<strong>*</strong></p>
                                <input type="text" placeholder="Entry Name" className="modal-content-input" onChange={(e) => setName(e.target.value)} maxLength={40}/>
                            </div>
                            <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                                <p>Value<strong>*</strong></p>
                                <CurrencyInput
                                    name="currency-input"
                                    placeholder="$1,000.00"
                                    decimalsLimit={2}
                                    prefix='$'
                                    onValueChange={onValueChange}
                                    />
                            </div>
                            <button onClick={addEntry}>Add Entry</button>
                        </div>
                        </div>
                        <div className='h-full w-full p-4 flex flex-col'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.name}</td>
                                            <td>{formatCurrencyString(entry.value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </ModalBody>
                <ModalFooter onActionCancel={() => onClose(false)} onActionComplete={() => handleCreateNewJournalEntry()} completeText='Create'/>
            </div>
        </div>
    );
};

export default CreateJournalEntryModal;