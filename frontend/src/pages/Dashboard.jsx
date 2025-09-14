import React, { useState, useEffect } from 'react';
import { 
  BoltIcon, 
  CurrencyDollarIcon, 
  SparklesIcon,
  PlayIcon,
  ChartBarIcon,
  Battery100Icon,
  SignalIcon,
  WifiIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { state, actions } = useApp();
  const { showSuccess, showInfo } = useToast();
  const { isDarkMode } = useTheme();
  const [simulationData, setSimulationData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    energyGeneration: { solar: 0, wind: 0, hydro: 0, total: 0 },
    marketPrices: { energyToken: 0, carbonCredits: 0, demand: 0 },
    systemStats: { activeUsers: 0, totalTransactions: 0, networkHashRate: 0 },
    lastUpdate: new Date()
  });
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Mock user address for demo
  const mockUserAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

  useEffect(() => {
    // Initialize user data when component mounts
    actions.initializeUser(mockUserAddress);
    
    // Simulate real-time data updates
    const realTimeInterval = setInterval(() => {
      setRealTimeData(prev => ({
        energyGeneration: {
          solar: Math.floor(Math.random() * 100) + 50,
          wind: Math.floor(Math.random() * 80) + 30,
          hydro: Math.floor(Math.random() * 60) + 20,
          total: Math.floor(Math.random() * 200) + 100
        },
        marketPrices: {
          energyToken: (Math.random() * 0.02 + 0.03).toFixed(4),
          carbonCredits: (Math.random() * 10 + 5).toFixed(2),
          demand: Math.floor(Math.random() * 100) + 50
        },
        systemStats: {
          activeUsers: Math.floor(Math.random() * 1000) + 500,
          totalTransactions: Math.floor(Math.random() * 10000) + 5000,
          networkHashRate: Math.floor(Math.random() * 1000000) + 500000
        },
        lastUpdate: new Date()
      }));
    }, 3000);

    return () => clearInterval(realTimeInterval);
  }, []);

  // Mock data for the chart
  const generateMockData = () => {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.getHours() + ':00',
        generation: Math.random() * 5 + 2,
        consumption: Math.random() * 3 + 1
      });
    }
    return data;
  };

  useEffect(() => {
    setSimulationData(generateMockData());
  }, []);

  const startSimulation = async () => {
    setIsSimulating(true);
    showInfo('Energy Simulation', 'Starting 24-hour energy generation simulation...');
    
    try {
      // Call the backend simulation API
      await actions.simulateEnergyData(mockUserAddress, 24);
      
      // Simulate real-time data updates
      const interval = setInterval(() => {
        setSimulationData(prev => {
          const newData = [...prev];
          const lastData = newData[newData.length - 1];
          newData.shift();
          newData.push({
            time: new Date().getHours() + ':00',
            generation: Math.random() * 5 + 2,
            consumption: Math.random() * 3 + 1
          });
          return newData;
        });
      }, 2000);

      setTimeout(() => {
        clearInterval(interval);
        setIsSimulating(false);
        showSuccess('Simulation Complete', 'Energy simulation completed successfully!');
      }, 30000);
    } catch (error) {
      console.error('Simulation failed:', error);
      setIsSimulating(false);
      showError('Simulation Failed', 'Failed to start energy simulation. Please try again.');
    }
  };

  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      userAddress: mockUserAddress,
      energyData: {
        battery: state.energy.battery,
        generation: state.energy.generation,
        consumption: state.energy.consumption,
        carbonCredits: state.energy.carbonCredits
      },
      tokenData: {
        balance: state.tokens.balance,
        offers: state.tokens.offers
      },
      simulationData: simulationData,
      realTimeData: realTimeData
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `energy-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess('Export Complete', 'Dashboard data exported successfully!');
  };

  const StatCard = ({ title, value, unit, icon: Icon, color = "blue" }) => (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {value}
                </div>
                <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">{unit}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Energy Dashboard</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Monitor your energy generation, consumption, and token balance</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportData}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={startSimulation}
                disabled={isSimulating}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isSimulating
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                {isSimulating ? 'Simulating...' : 'Start Simulation'}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="px-4 py-4 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <SignalIcon className={`h-5 w-5 ${connectionStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Real-time Data: {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex items-center">
                  <WifiIcon className="h-5 w-5 text-blue-500" />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Last update: {realTimeData.lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Active Users</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{realTimeData.systemStats.activeUsers.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Network Hash Rate</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{(realTimeData.systemStats.networkHashRate / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Overview Cards */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Energy Overview</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Battery Storage"
              value={state.energy.battery ? `${state.energy.battery.currentLevel}%` : '75%'}
              unit={state.energy.battery ? `${parseFloat(state.energy.battery.currentEnergy).toFixed(2)} kWh` : '75.00 kWh'}
              icon={Battery100Icon}
              color="green"
            />
            <StatCard
              title="Daily Energy Generated"
              value={state.energy.generation.length > 0 ? 
                state.energy.generation.reduce((sum, item) => sum + item.generation, 0).toFixed(1) : '45.2'}
              unit="kWh"
              icon={BoltIcon}
              color="yellow"
            />
            <StatCard
              title="Energy Tokens Balance"
              value={state.tokens.balance ? state.tokens.balance.toLocaleString() : '1,250'}
              unit="ET"
              icon={CurrencyDollarIcon}
              color="blue"
            />
            <StatCard
              title="Carbon Credits Earned"
              value={state.energy.carbonCredits ? state.energy.carbonCredits.totalCredits : '89'}
              unit="Credits"
              icon={SparklesIcon}
              color="green"
            />
          </div>
        </div>

        {/* Smart Meter Simulation */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                  Smart Meter Simulation
                </h2>
                <div className="flex items-center space-x-2">
                  {isSimulating && (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      Simulation Running
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="generation" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Generation (kWh)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Consumption (kWh)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Energy Generation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Energy Consumption</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div className="text-left">
                  <h3 className="text-lg font-medium text-gray-900">Trade Energy Tokens</h3>
                  <p className="text-sm text-gray-500">Buy or sell energy tokens in the marketplace</p>
                </div>
              </div>
            </button>
            
            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <BoltIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div className="text-left">
                  <h3 className="text-lg font-medium text-gray-900">View AI Suggestions</h3>
                  <p className="text-sm text-gray-500">Get optimized trading recommendations</p>
                </div>
              </div>
            </button>
            
            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <SparklesIcon className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <h3 className="text-lg font-medium text-gray-900">Invest in Microgrids</h3>
                  <p className="text-sm text-gray-500">Support renewable energy projects</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;