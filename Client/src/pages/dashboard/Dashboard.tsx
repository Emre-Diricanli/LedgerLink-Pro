import React, { useState } from 'react';
import AssetsDashboard from "../../components/dashboard/AssetsDashboard";
import DashboardHotbar from '../../components/dashboard/DashboardHotbar';
import DashboardNotifications from '../../components/dashboard/DashboardNotifications';
import LiabillitiesDashboard from '../../components/dashboard/LiabilitiesDashboard';

const Dashboard = () => {
    const [selectedDashboard, setSelectedDashboard] = useState('assets');

    const renderDashboard = () => {
        switch(selectedDashboard) {
            case 'assets':
                return <div className='flex flex-col w-full h-full'>
                    <AssetsDashboard />
                    {/* <AssetsDashboard /> */}
                </div>
            case 'liabilities':
                return <div className='flex flex-col w-full h-full'>
                    <LiabillitiesDashboard />
                </div>
            case 'equity':
                return <div className='flex flex-col w-full h-full'>
                    <p>Equity</p>
                </div>
            default:
                return <div className='flex flex-col w-full h-full'>
                    <AssetsDashboard />
                    {/* <AssetsDashboard /> */}
                </div>
        }
    };

    return (
        <div className='page-container'>
            <DashboardHotbar setSelectedDashboard={setSelectedDashboard} />
            <div className='flex flex-row w-full h-full'>
                {renderDashboard()}
                <div className='vertical-divider'></div>
                <DashboardNotifications />
            </div>
        </div>
    );
};

export default Dashboard;