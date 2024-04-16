import React, { useEffect, useState } from 'react';
import { useAccounts } from '../../Providers/AccountsProvider';
import { Account, TrialBalance } from '../../components/interfaces/Accounts';
import { Button } from '@mui/material';
import Ledger from '../ledger/Ledger';

interface TrialBalanceProps {
    // define your props here
}

const TrialBalancePage: React.FC<TrialBalanceProps> = ({}) => {
    const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null); // [1
    const [isLoading, setIsLoading] = useState(true);
    const accountsProvider = useAccounts();

    const [assets, setAssets] = useState<Account[]>([]);
    const [liabilities, setLiabilities] = useState<Account[]>([]);
    const [equity, setEquity] = useState<Account[]>([]);
    const [revenue, setRevenue] = useState<Account[]>([]);
    const [expenses, setExpenses] = useState<Account[]>([]);

    const [showLedger, setShowLedger] = useState(false); //controls ledger visibility
    const [accountForLedger, setAccountForLedger] = useState<Account | null>(null); //holds the account to show in the ledger
    
    const setLedger = (account: Account) => {
        setAccountForLedger(account);
        setShowLedger(true);
    }

    const hideLedger = () => {
        setShowLedger(false);
    }

    

    useEffect(() => {
        // Your code here
        const fetchTrialBalance = async () => {
            const trialBalance = await accountsProvider.getTrialBalance();

            setTrialBalance(trialBalance);

            //sort accounts into categories
            const assets = trialBalance.accounts.filter(account => account.category === 'Asset') || [];
            setAssets(assets);

            const liabilities = trialBalance.accounts.filter(account => account.category === 'Liability') || [];
            setLiabilities(liabilities);

            const equity = trialBalance.accounts.filter(account => account.category === 'Equity') || [];
            setEquity(equity);

            const revenue = trialBalance.accounts.filter(account => account.category === 'Revenue') || [];
            setRevenue(revenue);

            const expenses = trialBalance.accounts.filter(account => account.category === 'Expense') || [];
            setExpenses(expenses);
        }

        fetchTrialBalance();

        setIsLoading(false);
    }, []);

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className='page-container'>
            {showLedger ? (
                <>
                    {accountForLedger && <Ledger account={accountForLedger} hideLedger={hideLedger} />}
                </>
            ): (
                <div>

                    {isLoading ? (
                //spinner
                <div>
                    <h1>Loading...</h1>
                </div>
                    ) : (
                        <div className='flex flex-col w-full h-full'>
                        {trialBalance ? (
                            <div className='w-full h-full'>
                                <div className='flex flex-row w-full justify-between p-2'>
                                    <h2 className='ml-auto mr-auto'>Trial Balance</h2>
                                </div>
                                <div className='horizontal-divider'></div>

                                <div className='flex flex-row w-full content-center justify-center'>
                                    <div style={{width: '200px'}}>
                                        <p>Category</p>
                                    </div>
                                    <div style={{width: '200px'}}>
                                        <p>Account Name</p>
                                    </div>
                                    <div style={{width: '200px'}}>
                                        <p>Debit</p>
                                    </div>

                                    <div style={{width: '200px'}}>
                                        <p>Credit</p>
                                    </div>

                                    <div style={{width: '200px'}}>
                                        <p>Date Range</p>

                                    </div>
                                    <div style={{width: '200px'}}>
                                        <p>Ledger</p>
                                        </div>
                                </div>

                                <div className='horizontal-divider'></div>

                                <div className='flex flex-col'>
                                    <div className='flex flex-row w-full content-center justify-center pt-4'>
                                        <div style={{width: '200px'}}>
                                            <p>Assets</p>
                                        </div>
                                        <div style={{width: '200px'}}>

                                        </div>
                                        <div style={{width: '200px'}}>
                                            
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                            </div>

                                    </div>

                                    {/* foreach row in assets, create a 'row' */}
                                    {assets.map(account => (
                                        <div className='flex flex-row w-full content-center justify-center pt-4'>
                                            <div style={{width: '200px'}}>
                                                
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.accountName}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.debit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.credit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.dateRange}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <Button onClick={() => setLedger(account)}>View Ledger</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>


                                <div className='horizontal-divider'></div>

                                <div className='flex flex-col'>
                                    <div className='flex flex-row w-full content-center justify-center pt-4'>
                                        <div style={{width: '200px'}}>
                                            <p>Liabilities</p>
                                        </div>
                                        <div style={{width: '200px'}}>

                                        </div>
                                        <div style={{width: '200px'}}>
                                            
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                            </div>

                                    </div>

                                    {/* foreach row in assets, create a 'row' */}
                                    {liabilities.map(account => (
                                        <div className='flex flex-row w-full content-center justify-center pt-4'>
                                            <div style={{width: '200px'}}>
                                                
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.accountName}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.debit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.credit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.dateRange}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <Button onClick={() => setLedger(account)}>View Ledger</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='horizontal-divider'></div>

                                <div className='flex flex-col'>
                                    <div className='flex flex-row w-full content-center justify-center pt-4'>
                                        <div style={{width: '200px'}}>
                                            <p>Equity</p>
                                        </div>
                                        <div style={{width: '200px'}}>

                                        </div>
                                        <div style={{width: '200px'}}>
                                            
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                            </div>

                                    </div>

                                    {/* foreach row in assets, create a 'row' */}
                                    {equity.map(account => (
                                        <div className='flex flex-row w-full content-center justify-center pt-4'>
                                            <div style={{width: '200px'}}>
                                                
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.accountName}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.debit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.credit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.dateRange}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <Button onClick={() => setLedger(account)}>View Ledger</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='horizontal-divider'></div>

                                <div className='flex flex-col'>
                                    <div className='flex flex-row w-full content-center justify-center pt-4'>
                                        <div style={{width: '200px'}}>
                                            <p>Revenue</p>
                                        </div>
                                        <div style={{width: '200px'}}>

                                        </div>
                                        <div style={{width: '200px'}}>
                                            
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                            </div>

                                    </div>

                                    {/* foreach row in assets, create a 'row' */}
                                    {revenue.map(account => (
                                        <div className='flex flex-row w-full content-center justify-center pt-4'>
                                            <div style={{width: '200px'}}>
                                                
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.accountName}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.debit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.credit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.dateRange}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <Button onClick={() => setLedger(account)}>View Ledger</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='horizontal-divider'></div>

                                <div className='flex flex-col'>
                                    <div className='flex flex-row w-full content-center justify-center pt-4'>
                                        <div style={{width: '200px'}}>
                                            <p>Expenses</p>
                                        </div>
                                        <div style={{width: '200px'}}>

                                        </div>
                                        <div style={{width: '200px'}}>
                                            
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                        
                                        </div>
                                        <div style={{width: '200px'}}>
                                            </div>

                                    </div>

                                    {/* foreach row in assets, create a 'row' */}
                                    {expenses.map(account => (
                                        <div className='flex flex-row w-full content-center justify-center pt-4'>
                                            <div style={{width: '200px'}}>
                                                
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.accountName}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.debit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{formatCurrencyString(account.credit)}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <p>{account.dateRange}</p>
                                            </div>
                                            <div style={{width: '200px'}}>
                                                <Button onClick={() => setLedger(account)}>View Ledger</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='horizontal-divider'></div>
                                <div className='flex flex-row w-full content-center justify-center pt-4'>
                                    <div style={{width: '200px'}}>
                                        <p>Totals: </p>
                                    </div>
                                    <div style={{width: '200px'}}>
                                        <p></p>
                                    </div>
                                    <div style={{width: '200px'}}>
                                        <p>{formatCurrencyString(trialBalance.totalDebit)}</p>
                                    </div>

                                    <div style={{width: '200px'}}>
                                        <p>{formatCurrencyString(trialBalance.totalCredit)}</p>
                                    </div>

                                    <div style={{width: '200px'}}>
                                        <p>Date Range</p>

                                    </div>
                                    <div style={{width: '200px'}}>
                                        <p></p>
                                        </div>
                                </div>
                                
                            </div>
                            
                                ) : (
                                    <div>
                                        <h1>No Trial Balance Found</h1>
                                    </div>
                                
                            )}
                            </div>
                        )}

                </div>
            )}
        </div>
    );
}

export default TrialBalancePage;