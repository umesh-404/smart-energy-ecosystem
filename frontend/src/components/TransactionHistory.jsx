import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const TransactionHistory = ({ transactions = [] }) => {
  const { isDarkMode } = useTheme();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const TransactionRow = ({ transaction }) => (
    <div 
      className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700"
      onClick={() => setSelectedTransaction(transaction)}
    >
      <div className="flex items-center space-x-4">
        {getStatusIcon(transaction.status)}
        <div className="flex items-center space-x-2">
          <ArrowRightIcon className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {transaction.type === 'buy' ? 'Buy' : 'Sell'} {transaction.amount} ET
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.counterparty}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {transaction.price} ETH
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {transaction.timestamp}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {transaction.txHash.slice(0, 10)}...
          </div>
        </div>
        
        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <EyeIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const TransactionDetail = ({ transaction }) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        Transaction Details
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Type:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {transaction.type === 'buy' ? 'Buy Order' : 'Sell Order'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Amount:</span>
          <span className="text-gray-900 dark:text-gray-100">{transaction.amount} ET</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Price per Token:</span>
          <span className="text-gray-900 dark:text-gray-100">{transaction.pricePerToken} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Total Value:</span>
          <span className="text-gray-900 dark:text-gray-100">{transaction.price} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Counterparty:</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono">
            {transaction.counterparty}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Transaction Hash:</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
            {transaction.txHash}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Block Number:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {transaction.blockNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Gas Used:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {transaction.gasUsed}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Transaction History
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All your energy token transactions
        </p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {transactions.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 p-4 border-b border-gray-100 dark:border-gray-700">
              <div>Type</div>
              <div>Amount</div>
              <div>Price</div>
              <div className="text-right">Status</div>
            </div>
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        )}
      </div>
      
      {selectedTransaction && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <TransactionDetail transaction={selectedTransaction} />
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;