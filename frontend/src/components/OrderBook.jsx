import React, { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ClockIcon,
  UserIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const OrderBook = ({ orders = [], onOrderSelect }) => {
  const { isDarkMode } = useTheme();
  const [selectedTab, setSelectedTab] = useState('buy');

  // Separate buy and sell orders
  const buyOrders = orders.filter(order => order.type === 'buy').sort((a, b) => b.price - a.price);
  const sellOrders = orders.filter(order => order.type === 'sell').sort((a, b) => a.price - b.price);

  const OrderRow = ({ order, index }) => (
    <div 
      className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
        index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''
      }`}
      onClick={() => onOrderSelect && onOrderSelect(order)}
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          {order.type === 'buy' ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {order.sellerName}
          </span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i} 
                className={`h-3 w-3 ${
                  i < order.rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300 dark:text-gray-600'
                }`} 
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({order.totalTrades})
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 text-sm">
        <div className="text-right">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {order.amount} ET
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            {order.timestamp}
          </div>
        </div>
        <div className="text-right">
          <div className={`font-bold ${
            order.type === 'buy' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {order.price} ETH
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total: {(order.price * order.amount).toFixed(3)} ETH
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTab('buy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'buy'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Buy Orders ({buyOrders.length})
          </button>
          <button
            onClick={() => setSelectedTab('sell')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'sell'
                ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Sell Orders ({sellOrders.length})
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        <div className="p-3">
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-3">
            <div>Trader</div>
            <div className="text-center">Amount</div>
            <div className="text-right">Price</div>
          </div>
          
          {selectedTab === 'buy' ? (
            buyOrders.length > 0 ? (
              buyOrders.map((order, index) => (
                <OrderRow key={order.id} order={order} index={index} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No buy orders available
              </div>
            )
          ) : (
            sellOrders.length > 0 ? (
              sellOrders.map((order, index) => (
                <OrderRow key={order.id} order={order} index={index} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No sell orders available
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;