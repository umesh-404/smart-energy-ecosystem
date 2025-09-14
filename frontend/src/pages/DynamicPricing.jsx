import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  BoltIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useApp } from '../contexts/AppContext';

const DynamicPricing = () => {
  const { state, actions } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [pricingData, setPricingData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0.05);
  const [priceChange, setPriceChange] = useState(0.02);

  // Mock user address for demo
  const mockUserAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

  useEffect(() => {
    // Load AI pricing data when component mounts
    actions.loadAIPricing(selectedPeriod);
    generateMockPricingData();
  }, [selectedPeriod]);

  const generateMockPricingData = () => {
    const data = [];
    const now = new Date();
    const periods = selectedPeriod === '24h' ? 24 : selectedPeriod === '7d' ? 7 : 30;
    const interval = selectedPeriod === '24h' ? 1 : selectedPeriod === '7d' ? 24 : 24 * 7;

    for (let i = periods; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60 * 60 * 1000);
      const basePrice = 0.05;
      const variation = (Math.random() - 0.5) * 0.02;
      const demandFactor = Math.sin(i * 0.5) * 0.01;
      const price = Math.max(0.01, basePrice + variation + demandFactor);

      data.push({
        time: selectedPeriod === '24h' ? time.getHours() + ':00' : time.toLocaleDateString(),
        price: parseFloat(price.toFixed(4)),
        demand: Math.random() * 100,
        supply: Math.random() * 100,
        volume: Math.random() * 1000,
      });
    }

    setPricingData(data);
    
    // Set current price and change
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    setCurrentPrice(latest.price);
    setPriceChange(latest.price - previous.price);
  };

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change !== undefined && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change >= 0 ? (
                      <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                    )}
                    <span className="sr-only">{change >= 0 ? 'Increased' : 'Decreased'} by</span>
                    {Math.abs(change).toFixed(3)} ETH
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const PricePredictionCard = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">AI Price Prediction</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-900">Next Hour</span>
          <span className="text-lg font-bold text-blue-600">
            {(currentPrice + Math.random() * 0.01).toFixed(4)} ETH
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-green-900">Next 24 Hours</span>
          <span className="text-lg font-bold text-green-600">
            {(currentPrice + Math.random() * 0.02).toFixed(4)} ETH
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
          <span className="text-sm font-medium text-yellow-900">Next Week</span>
          <span className="text-lg font-bold text-yellow-600">
            {(currentPrice + Math.random() * 0.03).toFixed(4)} ETH
          </span>
        </div>
      </div>
    </div>
  );

  const MarketInsightsCard = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Market Insights</h3>
      <div className="space-y-3">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <BoltIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">High Demand Period:</span> Energy prices typically peak between 6-8 PM due to increased household consumption.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mt-0.5" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Renewable Boost:</span> Solar generation is expected to increase by 15% tomorrow, potentially lowering prices.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CurrencyDollarIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Trading Opportunity:</span> Current price is 8% below the 7-day average, suggesting a good buying opportunity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dynamic Pricing & AI Insights</h1>
        <p className="mt-2 text-gray-600">Real-time energy pricing and AI-powered market analysis</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {['24h', '7d', '30d'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedPeriod === period
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Current Price"
          value={`${currentPrice.toFixed(4)} ETH`}
          change={priceChange}
          icon={CurrencyDollarIcon}
          color="blue"
        />
        <StatCard
          title="24h Volume"
          value="1,250 ET"
          icon={ChartBarIcon}
          color="green"
        />
        <StatCard
          title="Market Cap"
          value="125,000 ETH"
          icon={ArrowTrendingUpIcon}
          color="purple"
        />
        <StatCard
          title="Active Trades"
          value="47"
          icon={BoltIcon}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Price Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Price vs Demand</h2>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-4 w-4 mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pricingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'price' ? `${value} ETH` : `${value}%`,
                      name === 'price' ? 'Price' : 'Demand'
                    ]}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="price"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="demand"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Predictions and Insights */}
        <div className="space-y-6">
          <PricePredictionCard />
          <MarketInsightsCard />
        </div>
      </div>

      {/* Trading Recommendations */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">AI Trading Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">Buy Recommendation</span>
              </div>
              <p className="text-sm text-green-700">
                Current price is below market average. Good time to buy Energy Tokens.
              </p>
              <button className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                Execute Buy Order
              </button>
            </div>
            
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-center mb-2">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-900">Wait & Watch</span>
              </div>
              <p className="text-sm text-yellow-700">
                Price volatility is high. Consider waiting for better entry point.
              </p>
              <button className="mt-3 w-full bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">
                Set Price Alert
              </button>
            </div>
            
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <BoltIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Energy Generation</span>
              </div>
              <p className="text-sm text-blue-700">
                Your solar panels are generating excess energy. Consider selling tokens.
              </p>
              <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Create Sell Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPricing;