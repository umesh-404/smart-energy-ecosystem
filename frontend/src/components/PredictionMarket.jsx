import React, { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const PredictionMarket = ({ predictions = [] }) => {
  const { isDarkMode } = useTheme();
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [userStake, setUserStake] = useState('');

  // Simulate real-time prediction data
  const [predictionData, setPredictionData] = useState([
    {
      id: 1,
      title: 'Energy Token Price Prediction',
      description: 'Will ET price reach 0.05 ETH by end of month?',
      currentPrice: 0.047,
      predictedPrice: 0.05,
      timeframe: '30 days',
      confidence: 78,
      totalStaked: 1250,
      participants: 89,
      status: 'active',
      oracle: 'Market Oracle',
      reward: 250
    },
    {
      id: 2,
      title: 'Solar Energy Generation Forecast',
      description: 'Will solar generation exceed 500kWh tomorrow?',
      currentGeneration: 420,
      predictedGeneration: 520,
      timeframe: '24 hours',
      confidence: 85,
      totalStaked: 890,
      participants: 67,
      status: 'active',
      oracle: 'Weather Oracle',
      reward: 180
    },
    {
      id: 3,
      title: 'Grid Outage Prediction',
      description: 'Will there be a major outage in Mumbai this week?',
      currentRisk: 'Low',
      predictedRisk: 'Medium',
      timeframe: '7 days',
      confidence: 45,
      totalStaked: 2100,
      participants: 156,
      status: 'active',
      oracle: 'Grid Monitor Oracle',
      reward: 420
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPredictionData(prev => prev.map(pred => ({
        ...pred,
        confidence: Math.max(10, Math.min(95, pred.confidence + (Math.random() - 0.5) * 5)),
        totalStaked: pred.totalStaked + Math.floor(Math.random() * 10),
        participants: pred.participants + (Math.random() > 0.8 ? 1 : 0)
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const PredictionCard = ({ prediction }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => setSelectedPrediction(prediction)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {prediction.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {prediction.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            prediction.status === 'active' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
          }`}>
            {prediction.status.toUpperCase()}
          </span>
          <div className="flex items-center text-yellow-500">
            <TrophyIcon className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{prediction.reward} ET</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Confidence</div>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
              <div 
                className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {prediction.confidence}%
            </span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Timeframe</div>
          <div className="flex items-center text-gray-900 dark:text-gray-100">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{prediction.timeframe}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
          <span>{prediction.totalStaked} ET staked</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          <span>{prediction.participants} participants</span>
        </div>
      </div>
    </div>
  );

  const PredictionDetail = ({ prediction }) => (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        Make Your Prediction
      </h5>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stake Amount (ET)
          </label>
          <input
            type="number"
            value={userStake}
            onChange={(e) => setUserStake(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter amount to stake"
          />
        </div>
        <div className="flex space-x-3">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            Predict YES
          </button>
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            Predict NO
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Oracle: {prediction.oracle} • Rewards distributed based on accuracy
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              Prediction Market
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Stake tokens on predictions and earn rewards for accuracy
            </p>
          </div>
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <LightBulbIcon className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">AI-Powered Insights</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {predictionData.map((prediction) => (
            <div key={prediction.id}>
              <PredictionCard prediction={prediction} />
              {selectedPrediction?.id === prediction.id && (
                <PredictionDetail prediction={prediction} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            How Prediction Markets Work
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <div>• Stake tokens on predictions about energy prices, generation, and outages</div>
            <div>• Oracles provide real-world data to validate predictions</div>
            <div>• Accurate predictions earn rewards from the pool</div>
            <div>• Community-driven insights improve system efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionMarket;