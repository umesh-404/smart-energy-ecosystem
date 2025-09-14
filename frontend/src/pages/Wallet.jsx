import React, { useState, useEffect } from 'react';
import { 
  WalletIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../contexts/AppContext';
import walletService from '../services/walletService';

const Wallet = () => {
  const { state, actions } = useApp();
  const [walletStatus, setWalletStatus] = useState({
    isConnected: false,
    account: null,
    chainId: null,
    balance: 0,
    isMetaMaskInstalled: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Check if MetaMask is installed
    const isInstalled = walletService.isMetaMaskInstalled();
    setWalletStatus(prev => ({ ...prev, isMetaMaskInstalled: isInstalled }));

    // Check if already connected
    const status = walletService.getConnectionStatus();
    if (status.isConnected) {
      setWalletStatus(prev => ({ ...prev, ...status }));
      loadWalletData();
    }
  }, []);

  const loadWalletData = async () => {
    if (!walletStatus.account) return;

    try {
      const balanceResult = await walletService.getBalance();
      if (balanceResult.success) {
        setWalletStatus(prev => ({ ...prev, balance: balanceResult.balance }));
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await walletService.connectWallet();
      
      if (result.success) {
        setWalletStatus(prev => ({
          ...prev,
          isConnected: true,
          account: result.account,
          chainId: result.chainId,
        }));

        // Load wallet data
        await loadWalletData();

        // Initialize user data in the app context
        await actions.initializeUser(result.account);

        setSuccess('Wallet connected successfully!');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchToMumbai = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await walletService.switchToMumbai();
      if (result.success) {
        setSuccess('Switched to Mumbai testnet successfully!');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = async () => {
    try {
      const result = await walletService.copyAddress();
      if (result.success) {
        setSuccess('Address copied to clipboard!');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Contract address copied to clipboard!');
    } catch (error) {
      setError('Failed to copy to clipboard');
    }
  };

  const disconnectWallet = () => {
    walletService.disconnect();
    setWalletStatus({
      isConnected: false,
      account: null,
      chainId: null,
      balance: 0,
      isMetaMaskInstalled: walletService.isMetaMaskInstalled(),
    });
    setSuccess('Wallet disconnected successfully!');
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 137: return 'Polygon Mainnet';
      case 80001: return 'Polygon Mumbai Testnet';
      case 31337: return 'Hardhat Local';
      default: return `Chain ID: ${chainId}`;
    }
  };

  const isCorrectNetwork = walletStatus.chainId === 80001; // Mumbai testnet

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Wallet</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Connect your MetaMask wallet to interact with the Smart Energy Ecosystem</p>
        </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{success}</div>
            </div>
          </div>
        </div>
      )}

      {/* MetaMask Installation Check */}
      {!walletStatus.isMetaMaskInstalled && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">MetaMask Not Installed</h3>
              <div className="mt-2 text-sm text-yellow-700">
                Please install MetaMask to connect your wallet. 
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-yellow-800 underline hover:text-yellow-900"
                >
                  Download MetaMask
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connection */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Wallet Connection</h2>
        
        {!walletStatus.isConnected ? (
          <div className="text-center">
            <WalletIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Connect your MetaMask wallet to get started</p>
            <button
              onClick={connectWallet}
              disabled={loading || !walletStatus.isMetaMaskInstalled}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Account Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Connected Account</p>
                <p className="text-sm text-gray-600 font-mono">
                  {walletService.formatAddress(walletStatus.account)}
                </p>
              </div>
              <button
                onClick={copyAddress}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Copy address"
              >
                <DocumentDuplicateIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Network Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Network</p>
                <p className="text-sm text-gray-600">
                  {getNetworkName(walletStatus.chainId)}
                </p>
              </div>
              {!isCorrectNetwork && (
                <button
                  onClick={switchToMumbai}
                  disabled={loading}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
                >
                  {loading ? 'Switching...' : 'Switch to Mumbai'}
                </button>
              )}
            </div>

            {/* Balance Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">MATIC Balance</p>
                <p className="text-sm text-gray-600">
                  {walletStatus.balance.toFixed(4)} MATIC
                </p>
              </div>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={disconnectWallet}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Token Balance */}
      {walletStatus.isConnected && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Token Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Energy Tokens (ET)</p>
              <p className="text-2xl font-bold text-blue-600">
                {state.tokens.balance ? state.tokens.balance.toLocaleString() : '0'}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Carbon Credits</p>
              <p className="text-2xl font-bold text-green-600">
                {state.energy.carbonCredits ? state.energy.carbonCredits.totalCredits : '0'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Addresses */}
      {walletStatus.isConnected && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Smart Contract Addresses</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Energy Token</p>
                <p className="text-xs text-gray-600 font-mono">
                  {walletService.getContractAddresses().ENERGY_TOKEN}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(walletService.getContractAddresses().ENERGY_TOKEN)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Copy address"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Trade Manager</p>
                <p className="text-xs text-gray-600 font-mono">
                  {walletService.getContractAddresses().TRADE_MANAGER}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(walletService.getContractAddresses().TRADE_MANAGER)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Copy address"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Compensation Manager</p>
                <p className="text-xs text-gray-600 font-mono">
                  {walletService.getContractAddresses().COMPENSATION_MANAGER}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(walletService.getContractAddresses().COMPENSATION_MANAGER)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Copy address"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Network</p>
              <p className="text-sm text-blue-700">
                {walletService.getNetworkInfo().name} (Chain ID: {walletService.getNetworkInfo().chainId})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {walletStatus.isConnected && isCorrectNetwork && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">Send Tokens</h3>
              <p className="text-sm text-gray-600">Transfer Energy Tokens to another address</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">View on Explorer</h3>
              <p className="text-sm text-gray-600">Check your transactions on PolygonScan</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">Export Wallet</h3>
              <p className="text-sm text-gray-600">Backup your wallet data</p>
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Wallet;