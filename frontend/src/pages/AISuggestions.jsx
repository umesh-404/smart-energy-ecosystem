import React, { useState, useEffect } from 'react';
import { 
  LightBulbIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../contexts/AppContext';
import PredictionMarket from '../components/PredictionMarket';

const AISuggestions = () => {
  const { state, actions } = useApp();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());

  // Mock user address for demo
  const mockUserAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

  useEffect(() => {
    loadAISuggestions();
  }, []);

  const loadAISuggestions = async () => {
    setLoading(true);
    try {
      await actions.loadAISuggestions(mockUserAddress);
      // Generate mock suggestions if API doesn't return data
      if (!state.ai.suggestions) {
        generateMockSuggestions();
      }
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
      generateMockSuggestions();
    } finally {
      setLoading(false);
    }
  };

  const generateMockSuggestions = () => {
    const mockSuggestions = [
      {
        id: 1,
        type: 'trading',
        priority: 'high',
        title: 'Buy Energy Tokens Now',
        description: 'Current market price is 12% below the 7-day average. This is an optimal buying opportunity.',
        confidence: 87,
        potentialGain: '+15%',
        timeframe: '24 hours',
        action: 'buy_tokens',
        details: {
          recommendedAmount: 100,
          maxPrice: 0.045,
          reason: 'Market analysis shows price correction expected within 24 hours'
        }
      },
      {
        id: 2,
        type: 'energy',
        priority: 'medium',
        title: 'Optimize Battery Usage',
        description: 'Your battery is 85% full. Consider selling excess energy during peak hours (6-8 PM).',
        confidence: 92,
        potentialGain: '+8%',
        timeframe: 'Today',
        action: 'sell_energy',
        details: {
          recommendedAmount: 15,
          optimalTime: '18:00-20:00',
          reason: 'Peak demand hours offer 20% higher prices'
        }
      },
      {
        id: 3,
        type: 'investment',
        priority: 'high',
        title: 'Invest in Solar Farm Project',
        description: 'New solar farm project offers 12% annual returns with milestone-based payouts.',
        confidence: 78,
        potentialGain: '+12%',
        timeframe: '1 year',
        action: 'invest_project',
        details: {
          projectId: 'solar-farm-alpha',
          minInvestment: 1000,
          expectedReturn: 12,
          reason: 'Government incentives and proven technology'
        }
      },
      {
        id: 4,
        type: 'trading',
        priority: 'low',
        title: 'Hold Current Position',
        description: 'Market volatility is high. Current position is well-balanced. No immediate action needed.',
        confidence: 65,
        potentialGain: '0%',
        timeframe: '1 week',
        action: 'hold',
        details: {
          reason: 'Portfolio is optimally balanced for current market conditions'
        }
      },
      {
        id: 5,
        type: 'energy',
        priority: 'medium',
        title: 'Schedule Energy Generation',
        description: 'Weather forecast shows sunny conditions tomorrow. Increase solar panel output.',
        confidence: 85,
        potentialGain: '+25%',
        timeframe: 'Tomorrow',
        action: 'optimize_generation',
        details: {
          weatherCondition: 'Sunny',
          expectedGeneration: 45,
          reason: 'Optimal weather conditions for solar generation'
        }
      }
    ];
    setSuggestions(mockSuggestions);
  };

  const applySuggestion = async (suggestion) => {
    try {
      // Simulate applying the suggestion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
      
      // Show success message
      alert(`Suggestion applied successfully! ${suggestion.title}`);
    } catch (error) {
      console.error('Error applying suggestion:', error);
      alert('Failed to apply suggestion. Please try again.');
    }
  };

  const dismissSuggestion = (suggestionId) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'trading': return CurrencyDollarIcon;
      case 'energy': return BoltIcon;
      case 'investment': return ArrowTrendingUpIcon;
      default: return LightBulbIcon;
    }
  };

  const getActionButtonText = (action) => {
    switch (action) {
      case 'buy_tokens': return 'Buy Tokens';
      case 'sell_energy': return 'Sell Energy';
      case 'invest_project': return 'Invest Now';
      case 'optimize_generation': return 'Optimize';
      case 'hold': return 'Hold Position';
      default: return 'Apply';
    }
  };

  const SuggestionCard = ({ suggestion }) => {
    const TypeIcon = getTypeIcon(suggestion.type);
    const priorityColor = getPriorityColor(suggestion.priority);
    const isApplied = appliedSuggestions.has(suggestion.id);

    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${priorityColor}-500 ${
        isApplied ? 'opacity-75' : ''
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <TypeIcon className="h-6 w-6 text-gray-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{suggestion.title}</h3>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-800`}>
                  {suggestion.priority} priority
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {suggestion.confidence}% confidence
                </span>
              </div>
            </div>
          </div>
          {!isApplied && (
            <button
              onClick={() => dismissSuggestion(suggestion.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-4">{suggestion.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm">
            <span className="font-medium text-gray-900">Potential Gain:</span>
            <span className={`ml-1 ${suggestion.potentialGain.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
              {suggestion.potentialGain}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-900">Timeframe:</span>
            <span className="ml-1 text-gray-600">{suggestion.timeframe}</span>
          </div>
        </div>

        {suggestion.details && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Details:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {Object.entries(suggestion.details).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-3">
          {!isApplied ? (
            <button
              onClick={() => applySuggestion(suggestion)}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark"
            >
              {getActionButtonText(suggestion.action)}
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Applied
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center">
          <SparklesIcon className="h-8 w-8 text-primary mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Suggestions</h1>
            <p className="mt-2 text-gray-600">Personalized recommendations to optimize your energy trading and investments</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Suggestions"
          value={suggestions.length}
          icon={LightBulbIcon}
          color="blue"
        />
        <StatsCard
          title="Applied Today"
          value={appliedSuggestions.size}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatsCard
          title="Success Rate"
          value="87%"
          icon={ArrowTrendingUpIcon}
          color="purple"
        />
        <StatsCard
          title="Avg. Gain"
          value="+12%"
          icon={CurrencyDollarIcon}
          color="yellow"
        />
      </div>

      {/* Refresh Button */}
      <div className="mb-6">
        <button
          onClick={loadAISuggestions}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Suggestions'}
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-6">
        {suggestions.length === 0 ? (
          <div className="text-center py-12">
            <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions available</h3>
            <p className="mt-1 text-sm text-gray-500">
              AI is analyzing your data to provide personalized recommendations.
            </p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))
        )}
      </div>

      {/* AI Insights */}
      <div className="mt-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">AI Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Market Trends</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Energy token prices are trending upward (+5.2% this week)</li>
                <li>• Solar generation is expected to increase by 15% tomorrow</li>
                <li>• Peak demand hours (6-8 PM) offer 20% higher prices</li>
                <li>• Carbon credit values are stable with slight upward trend</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Your Portfolio</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Your energy generation is 12% above average</li>
                <li>• Battery utilization is optimal (75% capacity)</li>
                <li>• Token balance is well-diversified</li>
                <li>• Investment returns are 8% above market average</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prediction Market */}
        <div className="px-4 py-6 sm:px-0">
          <PredictionMarket />
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;