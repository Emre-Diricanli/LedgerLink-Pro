import React, { useState, useEffect } from 'react';
import ModalBody from '../../Modal/ModalBody';
import ModalFooter from '../../Modal/ModalFooter';
import ModalHeader from '../../Modal/ModalHeader';
import { Account, AccountTransaction, JournalEntryLineDTO } from '../../interfaces/Accounts';
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
    credit: number;
    debit: number;
    [key: string]: string | number;
}

const CreateJournalEntryModal: React.FC<CreateJournalEntryModalProps> = ({account, isOpen, onClose }) => {
    if (!isOpen) return null;
    const accountsProvider = useAccounts();

    const [entries, setEntries] = useState<Entry[]>([]);
    const [name, setName] = useState<string>('');

    const [credit, setCredit] = useState<number>(0);
    const [debit, setDebit] = useState<number>(0);

    const onCreditChange = (value: string | undefined) => {
        if (value) {
            setCredit(Number(value));
        } else {
            setCredit(0);
        }
    }

    const onDebitChange = (value: string | undefined) => {
        if (value) {
            setDebit(Number(value));
        } else {
            setDebit(0);
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
        setEntries([...entries, { name: name, credit: credit, debit: debit }]);
        setName('');
        setCredit(0);
        setDebit(0);
    };

    const handleCreateNewJournalEntry = async () => {
        //convert entries to JournalEntryLineDTO
        const newEntries: JournalEntryLineDTO[] = entries.map((entry, index) => {
            return {
                index: index,
                credit: Number(entry.credit),
                debit: Number(entry.debit),
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
                        <div className='h-full w-full p-4 flex flex-col'>
                            <div className='flex flex-row items-end gap-4'>  
                                <div className="flex flex-col content-center items-center justify-center gap-4 w-full pt-8">
                                    <div className="flex flex-col content-center justify-start gap-0 w-full">
                                        <p>Line Name<strong>*</strong></p>
                                        <input type="text" placeholder="Line Name" className="modal-content-input" onChange={(e) => setName(e.target.value)} maxLength={40}/>
                                    </div>
                                    <div className='flex flex-row gap-4'>
                                        <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                                            <p>Credit<strong>*</strong></p>
                                            <CurrencyInput
                                                name="currency-input"
                                                placeholder="$1,000.00"
                                                decimalsLimit={2}
                                                prefix='$'
                                                onValueChange={onCreditChange}
                                                />
                                        </div>
                                        <div className="flex flex-col content-center justify-start gap-0 w-full pt-8">
                                            <p>Debit<strong>*</strong></p>
                                            <CurrencyInput
                                                name="currency-input"
                                                placeholder="$1,000.00"
                                                decimalsLimit={2}
                                                prefix='$'
                                                onValueChange={onDebitChange}
                                                />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={addEntry} style={{height: `60px`, whiteSpace: 'nowrap'}}>Add Entry</button>
                            </div>
                        </div>
                        <div className='h-full w-full p-4 flex flex-col'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Credit</th>
                                        <th>Debit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.name}</td>
                                            <td>{formatCurrencyString(entry.credit)}</td>
                                            <td>{formatCurrencyString(entry.debit)}</td>
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