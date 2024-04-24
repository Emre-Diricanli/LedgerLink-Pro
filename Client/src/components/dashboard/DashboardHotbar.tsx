import React, { useEffect, useRef, useState } from 'react';

interface DashboardHotbarProps {
    // set selected dashboard
    setSelectedDashboard: (selectedDashboard: string) => void;
}

const DashboardHotbar: React.FC<DashboardHotbarProps> = ({
    setSelectedDashboard
}) => {

    // Hotbar content goes here, similar to what was inside UserManagement component
    return (
        <div className='w-full'>
            <div className='hotbar justify-start'>
                <div className='flex flex-col items-start w-fit'>
                    <p>Selected Dashboard</p>
                    <select onChange={(e) => setSelectedDashboard(e.target.value)}>
                        <option value="assets">Assets</option>
                        <option value="liabilities">Liabilities</option>
                        <option value="equity">Equity</option>
                    </select>
               </div>
            </div>
        </div>
    );
};

export default DashboardHotbar;
