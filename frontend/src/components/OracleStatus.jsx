import React, { useState, useEffect } from 'react';
import { 
  WifiIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  BoltIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const OracleStatus = ({ outageData = [] }) => {
  const { isDarkMode } = useTheme();
  const [oracleStatus, setOracleStatus] = useState({
    status: 'connected',
    lastUpdate: new Date(),
    activeOracles: 3,
    totalOracles: 5,
    reliability: 99.8
  });

  const [realTimeData, setRealTimeData] = useState({
    activeOutages: 2,
    affectedUsers: 1247,
    totalCompensation: 156.8,
    avgResponseTime: '2.3 minutes'
  });

  useEffect(() => {
    // Simulate real-time oracle updates
    const interval = setInterval(() => {
      setOracleStatus(prev => ({
        ...prev,
        lastUpdate: new Date(),
        reliability: 99.5 + Math.random() * 0.5
      }));
      
      setRealTimeData(prev => ({
        activeOutages: Math.max(0, prev.activeOutages + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        affectedUsers: prev.affectedUsers + Math.floor((Math.random() - 0.5) * 100),
        totalCompensation: prev.totalCompensation + (Math.random() * 2),
        avgResponseTime: `${(2 + Math.random()).toFixed(1)} minutes`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const OracleCard = ({ oracle, index }) => (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${
          oracle.status === 'active' ? 'bg-green-500' : 
          oracle.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {oracle.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {oracle.type} • Uptime: {oracle.uptime}%
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {oracle.reliability}%
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Last: {oracle.lastUpdate}
        </div>
      </div>
    </div>
  );

  const oracles = [
    { id: 1, name: 'Grid Monitor Oracle', type: 'IoT', status: 'active', uptime: 99.9, reliability: 99.8, lastUpdate: '2s ago' },
    { id: 2, name: 'Weather Oracle', type: 'External API', status: 'active', uptime: 99.5, reliability: 99.2, lastUpdate: '5s ago' },
    { id: 3, name: 'Power Grid Oracle', type: 'Utility API', status: 'warning', uptime: 98.1, reliability: 97.8, lastUpdate: '1m ago' },
    { id: 4, name: 'Emergency Services Oracle', type: 'Government API', status: 'active', uptime: 99.7, reliability: 99.1, lastUpdate: '3s ago' },
    { id: 5, name: 'Smart Meter Oracle', type: 'Device Network', status: 'active', uptime: 99.3, reliability: 98.9, lastUpdate: '1s ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Oracle Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Oracle Network Status
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              oracleStatus.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {oracleStatus.status === 'connected' ? 'All Systems Operational' : 'Connection Issues'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {oracleStatus.activeOracles}/{oracleStatus.totalOracles}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Oracles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {oracleStatus.reliability}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Reliability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {oracleStatus.lastUpdate.toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Last Update</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {oracles.map((oracle) => (
            <OracleCard key={oracle.id} oracle={oracle} />
          ))}
        </div>
      </div>

      {/* Real-time Outage Monitoring */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Real-time Outage Monitoring
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {realTimeData.activeOutages}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Outages</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <UsersIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {realTimeData.affectedUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Affected Users</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <BoltIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {realTimeData.totalCompensation.toFixed(1)} ETH
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Compensation</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <ClockIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {realTimeData.avgResponseTime}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Automated Compensation Process
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Oracle detects outage through IoT sensors and utility APIs
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Smart contract automatically calculates affected users
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Compensation tokens distributed to user wallets
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
              Users can appeal compensation decisions through DAO voting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleStatus;