// AssetsDashboard.tsx
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarController, BarElement } from 'chart.js';
import { useSystems } from '../../Providers/SystemsProvider';
import Dashboard from '../../pages/dashboard/Dashboard';
import { DashboardInfoDTO } from '../interfaces/Accounts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarController, BarElement);

type AssetEntry = {
    date: string;  // Date in YYYY-MM-DD format
    value: number; // Asset value
    account: string; // Account name
};

class AssetData {
    private assets: AssetEntry[];

    constructor() {
        this.assets = [];
    }

    addAsset(date: string, value: number, account: string) {
        this.assets.push({ date, value, account });
    }

    getAssetDataByAccount(accountType: string) {
        return this.assets.filter(asset => asset.account === accountType);
    }

    getAssetData() {
        return this.assets;
    }
};


const getLineData = (assetData: AssetData) => {
    const creditData = assetData.getAssetDataByAccount('Credit').map(asset => asset.value);
    const debitData = assetData.getAssetDataByAccount('Debit').map(asset => asset.value);
    const labels = assetData.getAssetDataByAccount('Credit').map(asset => asset.date); // Assuming dates are the same for credits and debits

    return {
        labels,
        datasets: [
            {
                label: 'Credit Value',
                data: creditData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)', // Greenish
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Debit Value',
                data: debitData,
                fill: false,
                borderColor: 'rgb(255, 99, 132)', // Reddish
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }
        ],
    };
};


const getBarData = (assetData: AssetData, accountType: string) => {
    const filteredData = assetData.getAssetDataByAccount(accountType);
    const labels = filteredData.map(asset => asset.date);
    const data = filteredData.map(asset => asset.value);

    return {
        labels,
        datasets: [
            {
                label: `${accountType} Asset Value`,
                data,
                backgroundColor: accountType === 'Credit' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
            },
        ],
    };
};

const ExpensesDashboard = (props: {}) => {
    const [creditAssetData, setCreditAssetData] = useState<AssetData>(new AssetData());
    const [debitAssetData, setDebitAssetData] = useState<AssetData>(new AssetData());
    const systemsProvider = useSystems();

    //get data from server
    useEffect(() => {
        const fetchAssetData = async () => {
            const apiUrl = systemsProvider.apiUrl;
            const response = await fetch(`${apiUrl}/accounts/get-dashboard-info?accountType=Expenses`);
    
            if (response.status === 200) {
                const data = await response.json() as DashboardInfoDTO;
                const creditData = new AssetData();
                const debitData = new AssetData();
    
                data.creditDebitMonth.forEach(month => {
                    creditData.addAsset(month.month, month.credit, 'Credit');
                    debitData.addAsset(month.month, month.debit, 'Debit');
                });
    
                setCreditAssetData(creditData);
                setDebitAssetData(debitData);
            }
        };
    
        fetchAssetData();


    }, []);

    useEffect(() => {
        console.log(creditAssetData.getAssetData());
        console.log(debitAssetData.getAssetData());
    }, [creditAssetData, debitAssetData]);
    

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className='w-full h-full p-4'>
            <Line data={getLineData(creditAssetData)} options={options} />
            <div className='flex flex-row'>
                <div className='flex flex-col w-1/2'>
                    <Bar data={getBarData(creditAssetData, 'Credit')} options={options} />
                </div>
                <div className='flex flex-col w-1/2'>
                    <Bar data={getBarData(debitAssetData, 'Debit')} options={options} />
                </div>

            </div>
        </div>
    );
};

export default ExpensesDashboard;