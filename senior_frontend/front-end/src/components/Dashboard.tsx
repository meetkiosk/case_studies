import React, { useState,useEffect } from 'react';
import TimeGranularitySwitch from './TimeGranularitySwitch';
import { ApiService } from '../services/api';
import { Indicator } from '../types';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<Indicator[]>([]);
    const [timeGranularity, setTimeGranularity] = useState('monthly');
    const apiService = new ApiService();

    useEffect(() => {
        apiService.fetchIndicators(timeGranularity).then((data) => setData(data));
    }, [timeGranularity]);

    const handleGranularityChange = (granularity: string) => {
        setTimeGranularity(granularity);
    };

    return (
    <div className="p-4">
        <div className="flex justify-between items-center">
        <h2 className="text-2xl mb-4">ESG Indicators</h2>
        </div>
        <TimeGranularitySwitch
        currentGranularity={timeGranularity} onChange={handleGranularityChange}
        />
    </div>
    );
};

export default Dashboard;