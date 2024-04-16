import React, { useEffect, useState } from 'react';
import { useAccounts } from '../../Providers/AccountsProvider';
import { Account, TrialBalance } from '../../components/interfaces/Accounts';
import { Button } from '@mui/material';
import Ledger from '../ledger/Ledger';
import { useSystems } from '../../Providers/SystemsProvider';

interface TrialBalanceProps {
    // define your props here
}

const TrialBalancePage: React.FC<TrialBalanceProps> = ({}) => {
    const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);
    const [originalTrialBalance, setOriginalTrialBalance] = useState<TrialBalance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const accountsProvider = useAccounts();

    const [assets, setAssets] = useState<Account[]>([]);
    const [liabilities, setLiabilities] = useState<Account[]>([]);
    const [equity, setEquity] = useState<Account[]>([]);
    const [revenue, setRevenue] = useState<Account[]>([]);
    const [expenses, setExpenses] = useState<Account[]>([]);

    const [showLedger, setShowLedger] = useState(false); //controls ledger visibility
    const [accountForLedger, setAccountForLedger] = useState<Account | null>(null); //holds the account to show in the ledger

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const SystemsProvider = useSystems();
    
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
            const trialBalance = await accountsProvider.getTrialBalance(undefined, undefined);

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

            const expenses = trialBalance.accounts.filter(account => account.category === 'Expenses') || [];
            setExpenses(expenses);

            //set min and max dates
            const dateRangeString = trialBalance.dateRange;
            const minDate = new Date(dateRangeString.split(' - ')[0]);
            const maxDate = new Date(dateRangeString.split(' - ')[1]);

            setStartDate(minDate);
            setEndDate(maxDate);

            //set original trial balance
            setOriginalTrialBalance(trialBalance);
        }

        fetchTrialBalance();

        setIsLoading(false);
    }, []);

    const formatCurrencyString = (amount: number) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const toggleIsLoading = () => {
        setIsLoading(!isLoading);
    }

    const getTrialBalanceDownload = async () => {
        //make end date time max
        const endDate2 = new Date();
        endDate2.setHours(23, 59, 59, 999);
        const queryParameters = `?startDate=${startDate.toISOString()}&endDate=${endDate2.toISOString()}`;
        const apiUrl = SystemsProvider.apiUrl + '/accounts/export-trial-balance-html' + queryParameters;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
            
        });

        //if response is okay then download the file
        if(response.ok){
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'trial-balance.html';
            a.click();
        }
        else{
            console.error('Failed to download trial balance');
        }

    };

    const getIncomeStatementDownload = async () => {
        //make end date time max
        const endDate2 = new Date();
        endDate2.setHours(23, 59, 59, 999);
        const queryParameters = `?startDate=${startDate.toISOString()}&endDate=${endDate2.toISOString()}`;
        const apiUrl = SystemsProvider.apiUrl + '/accounts/export-income-statement-html' + queryParameters;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
            
        });

        //if response is okay then download the file
        if(response.ok){
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'income-statement.html';
            a.click();
        }
        else{
            console.error('Failed to download income statement');
        }

    }


    // Remove unused function
    const dateRangeChanged = async () => {

        try{
            //toggleIsLoading();

            //get trial balance from accountsProvider with new dates
            const newTrialBalance = await accountsProvider.getTrialBalance(startDate, endDate);

            //sort accounts into categories
            const assets = newTrialBalance.accounts.filter(account => account.category === 'Asset') || [];

            const liabilities = newTrialBalance.accounts.filter(account => account.category === 'Liability') || [];

            const equity = newTrialBalance.accounts.filter(account => account.category === 'Equity') || [];

            const revenue = newTrialBalance.accounts.filter(account => account.category === 'Revenue') || [];

            const expenses = newTrialBalance.accounts.filter(account => account.category === 'Expense') || [];

            //set min and max dates
            const dateRangeString = newTrialBalance.dateRange;
            const minDate = new Date(dateRangeString.split(' - ')[0]);

            const maxDate = new Date(dateRangeString.split(' - ')[1]);

            //set original trial balance
            setOriginalTrialBalance(newTrialBalance);

            //set trial balance
            setTrialBalance(newTrialBalance);

            //set accounts
            setAssets(assets);

            setLiabilities(liabilities);

            setEquity(equity);

            setRevenue(revenue);

            setExpenses(expenses);
        }
        catch(e){
            console.error(e);
        }
        finally{
            //toggleIsLoading();
        }
    }

    return (
        <div className='page-container'>
            {showLedger ? (
                <>
                    {accountForLedger && <Ledger account={accountForLedger} hideLedger={hideLedger} />}
                </>
            ): (
                <div className='h-full'>

                    {isLoading ? (
                //spinner
                <div>
                    <h1>Loading...</h1>
                </div>
                    ) : (
                        <div className='flex flex-col w-full h-full'>
                        {trialBalance ? (
                            <div className='w-full h-full justify-center'>
                            
                                <div className='flex flex-row w-full justify-between p-2'>
                                    <h2 className='ml-auto mr-auto'>Trial Balance</h2>
                                </div>
                                
                                <div className='mb-8'>
                                    <div className='flex flex-col h-full w-full justify-center items-center gap-4'>
                                            <p>Select Date Range</p>
                                            <div className='flex flex-row gap-4'>
                                                <input type='date' value={startDate.toISOString().split('T')[0]} onChange={(e) => setStartDate(new Date(e.target.value))} />
                                                <input type='date' value={endDate.toISOString().split('T')[0]} onChange={(e) => setEndDate(new Date(e.target.value))} />
                                            </div>
                                            <button onClick={dateRangeChanged}>Apply</button>
                                    </div>
                                </div>

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
                                        <>
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
                                        <div className='horizontal-divider'></div>
                                        
                                        </>
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

                                <div className='horizontal-divider mt-8'></div>
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
                                        <p>{trialBalance.dateRange}</p>

                                    </div>
                                    <div style={{width: '200px'}}>
                                        <p></p>
                                        </div>
                                </div>
                                <div className='horizontal-divider'></div>
                                <div className='pt-8 flex flex-col justify-center items-center'>
                                    <h3>Export</h3>
                                    <div className='w-full flex flex-row justify-center gap-4 pt-8'>

                                    <button onClick={() => getTrialBalanceDownload()}>Trial Balance</button>
                                    <button onClick={() => getIncomeStatementDownload()}>Income Statement</button>


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