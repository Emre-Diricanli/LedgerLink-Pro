// AssetsDashboard.tsx
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarController, BarElement } from 'chart.js';

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

    getAssetData() {
        return this.assets;
    }
}

const AssetsDashboard = (props: {}) => {
    const [assetData, setAssetData] = useState<AssetData>(new AssetData());

    // Generate random data
    useEffect(() => {
        const newData = new AssetData();
        const startDate = new Date('2024-01-01');
        const accounts = ['Account1', 'Account2', 'Account3'];

        for (let i = 0; i < 4; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth() + i);
            const dateString = date.toISOString().split('T')[0];
            const value = Math.floor(Math.random() * 50000) + 10000;
            const account = accounts[Math.floor(Math.random() * accounts.length)];

            newData.addAsset(dateString, value, account);
        }

        setAssetData(newData);
    }, []);

    const lineData = {
        labels: assetData.getAssetData().map(entry => entry.date),
        datasets: [
            {
                label: 'Assets Over Time',
                data: assetData.getAssetData().map(entry => entry.value),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const accounts = [...new Set(assetData.getAssetData().map(entry => entry.account))]; // Get unique account names
    const barData = {
        labels: accounts,
        datasets: [{
            label: 'Assets in Each Account',
            data: accounts.map(account => 
                assetData.getAssetData().filter(entry => entry.account === account).reduce((sum, entry) => sum + entry.value, 0)
            ),
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
        }],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className='w-full h-full p-4'>
            <Line data={lineData} options={options} />
            <Bar data={barData} options={options} />
        </div>
    );
};

export default AssetsDashboard;