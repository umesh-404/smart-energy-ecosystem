import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
  ShoppingCartIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import OrderBook from '../components/OrderBook';
import TransactionHistory from '../components/TransactionHistory';

const Marketplace = () => {
  const { state, actions } = useApp();
  const { showSuccess, showError, showInfo } = useToast();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minAmount: '',
    maxAmount: '',
    location: '',
    sortBy: 'price'
  });

  // Mock user address for demo
  const mockUserAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';

  useEffect(() => {
    // Load trade offers when component mounts
    actions.loadTradeOffers();
  }, []);

  // Use real data from state or fallback to mock data
  const tradeOffers = (state.tokens.offers && state.tokens.offers.length > 0) ? state.tokens.offers : [
    {
      id: 1,
      seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      sellerName: 'Solar Farm Alpha',
      amount: 100,
      pricePerToken: 0.05, // ETH
      totalPrice: 5.0,
      location: 'Mumbai, India',
      timestamp: '2025-01-13T10:30:00Z',
      isActive: true
    },
    {
      id: 2,
      seller: '0x8ba1f109551bD432803012645Hac136c',
      sellerName: 'Wind Energy Co.',
      amount: 250,
      pricePerToken: 0.048,
      totalPrice: 12.0,
      location: 'Delhi, India',
      timestamp: '2025-01-13T09:15:00Z',
      isActive: true
    },
    {
      id: 3,
      seller: '0x1234567890123456789012345678901234567890',
      sellerName: 'Green Power Ltd.',
      amount: 75,
      pricePerToken: 0.052,
      totalPrice: 3.9,
      location: 'Bangalore, India',
      timestamp: '2025-01-13T08:45:00Z',
      isActive: true
    },
    {
      id: 4,
      seller: '0xabcdef1234567890abcdef1234567890abcdef12',
      sellerName: 'Hydro Electric',
      amount: 500,
      pricePerToken: 0.045,
      totalPrice: 22.5,
      location: 'Chennai, India',
      timestamp: '2025-01-13T07:20:00Z',
      isActive: true
    }
  ];

  useEffect(() => {
    if (!tradeOffers || !Array.isArray(tradeOffers)) {
      setFilteredOffers([]);
      return;
    }

    let filtered = tradeOffers.filter(offer => offer && offer.sellerName && offer.location && offer.amount);

    // Apply search term filter
    if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
      filtered = filtered.filter(offer =>
        offer.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.amount.toString().includes(searchTerm)
      );
    }

    // Apply advanced filters
    if (filters.minPrice) {
      filtered = filtered.filter(offer => offer.totalPrice >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(offer => offer.totalPrice <= parseFloat(filters.maxPrice));
    }
    if (filters.minAmount) {
      filtered = filtered.filter(offer => offer.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(offer => offer.amount <= parseFloat(filters.maxAmount));
    }
    if (filters.location) {
      filtered = filtered.filter(offer => 
        offer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.totalPrice - b.totalPrice;
        case 'price-desc':
          return b.totalPrice - a.totalPrice;
        case 'amount':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    setFilteredOffers(filtered);
  }, [searchTerm, tradeOffers, filters]);

  const handleBuyOffer = (offer) => {
    setSelectedOffer(offer);
    setShowBuyModal(true);
  };

  const confirmPurchase = async () => {
    try {
      showInfo('Processing Purchase', 'Executing blockchain transaction...');
      
      // Ensure we have a valid buyer address
      const buyerAddress = mockUserAddress || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      
      // Call the backend API to execute the trade
      await actions.buyTokens({
        buyerAddress: buyerAddress,
        offerId: selectedOffer.id,
        amount: selectedOffer.amount
      });
      
      showSuccess('Purchase Successful!', `You bought ${selectedOffer.amount} ET for ${selectedOffer.totalPrice} ETH`);
      setShowBuyModal(false);
      setSelectedOffer(null);
      
      // Refresh the data
      actions.loadTradeOffers();
      actions.loadTokenBalance(buyerAddress);
    } catch (error) {
      console.error('Purchase failed:', error);
      showError('Purchase Failed', 'Failed to complete the purchase. Please try again.');
    }
  };

  const OfferCard = ({ offer }) => {
    if (!offer || !offer.sellerName || !offer.seller) {
      return null;
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{offer.sellerName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{offer.seller.slice(0, 10)}...{offer.seller.slice(-8)}</p>
            </div>
          </div>
        <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{offer.amount} ET</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Price per Token</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{offer.pricePerToken} ETH</p>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <MapPinIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
        <span className="text-sm text-gray-600 dark:text-gray-300">{offer.location}</span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{offer.totalPrice} ETH</p>
        </div>
        <button
          onClick={() => handleBuyOffer(offer)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          Buy Now
        </button>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Energy Token Marketplace</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Buy and sell energy tokens from renewable energy producers</p>
        </div>

        {/* Search and Filters */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by location, seller, or amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                  Filters
                </button>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="amount">Amount: Low to High</option>
                  <option value="amount-desc">Amount: High to Low</option>
                  <option value="location">Location: A to Z</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Price (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Price (ETH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="100.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Amount (ET)</label>
                    <input
                      type="number"
                      value={filters.minAmount}
                      onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Amount (ET)</label>
                    <input
                      type="number"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setFilters({
                      minPrice: '',
                      maxPrice: '',
                      minAmount: '',
                      maxAmount: '',
                      location: '',
                      sortBy: 'price'
                    })}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">0.049 ETH</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <ShoppingCartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Offers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tradeOffers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <MapPinIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">43.4 ETH</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Marketplace Sections */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Live Order Book */}
            <div>
              <OrderBook 
                orders={[
                  {
                    id: 1,
                    type: 'buy',
                    sellerName: 'Solar Farm Alpha',
                    amount: 100,
                    price: 0.048,
                    rating: 4.8,
                    totalTrades: 156,
                    timestamp: '2m ago'
                  },
                  {
                    id: 2,
                    type: 'sell',
                    sellerName: 'Wind Energy Co.',
                    amount: 75,
                    price: 0.051,
                    rating: 4.6,
                    totalTrades: 89,
                    timestamp: '5m ago'
                  },
                  {
                    id: 3,
                    type: 'buy',
                    sellerName: 'Hydro Power Ltd.',
                    amount: 200,
                    price: 0.047,
                    rating: 4.9,
                    totalTrades: 234,
                    timestamp: '8m ago'
                  }
                ]}
              />
            </div>
            
            {/* Transaction History */}
            <div>
              <TransactionHistory 
                transactions={[
                  {
                    id: 1,
                    type: 'buy',
                    amount: 50,
                    price: 2.4,
                    pricePerToken: 0.048,
                    counterparty: '0x742d...5b6',
                    status: 'completed',
                    timestamp: '2 hours ago',
                    txHash: '0x1234567890abcdef1234567890abcdef12345678',
                    blockNumber: 45234567,
                    gasUsed: '21000'
                  },
                  {
                    id: 2,
                    type: 'sell',
                    amount: 25,
                    price: 1.25,
                    pricePerToken: 0.05,
                    counterparty: '0x8ba1...36c',
                    status: 'completed',
                    timestamp: '1 day ago',
                    txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
                    blockNumber: 45234001,
                    gasUsed: '21000'
                  },
                  {
                    id: 3,
                    type: 'buy',
                    amount: 100,
                    price: 4.7,
                    pricePerToken: 0.047,
                    counterparty: '0x1234...890',
                    status: 'pending',
                    timestamp: '5 minutes ago',
                    txHash: '0x567890abcdef1234567890abcdef1234567890ab',
                    blockNumber: 45234600,
                    gasUsed: '21000'
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Trade Offers Grid */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Available Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>

        {/* Buy Modal */}
        {showBuyModal && selectedOffer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Purchase</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seller:</span>
                    <span className="font-medium">{selectedOffer.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{selectedOffer.amount} ET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Token:</span>
                    <span className="font-medium">{selectedOffer.pricePerToken} ETH</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-semibold">Total:</span>
                    <span className="text-blue-600 font-bold">{selectedOffer.totalPrice} ETH</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPurchase}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;