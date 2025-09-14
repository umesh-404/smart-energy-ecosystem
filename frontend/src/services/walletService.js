// Wallet service for MetaMask integration
import { CONTRACT_ADDRESSES } from '../config/contracts.js';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  }

  // Connect to MetaMask
  async connectWallet() {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      this.account = accounts[0];
      this.provider = window.ethereum;
      this.chainId = await this.getChainId();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          this.disconnect();
        } else {
          this.account = newAccounts[0];
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (newChainId) => {
        this.chainId = parseInt(newChainId, 16);
        window.location.reload(); // Reload to update the app
      });

      return {
        success: true,
        account: this.account,
        chainId: this.chainId,
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get current chain ID
  async getChainId() {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting chain ID:', error);
      return null;
    }
  }

  // Switch to Mumbai testnet
  async switchToMumbai() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Mumbai testnet chain ID
      });
      return { success: true };
    } catch (error) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        return await this.addMumbaiNetwork();
      }
      return { success: false, error: error.message };
    }
  }

  // Add Mumbai testnet to MetaMask
  async addMumbaiNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x13881',
            chainName: 'Polygon Mumbai',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com'],
          },
        ],
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get account balance
  async getBalance() {
    try {
      if (!this.account) {
        throw new Error('No account connected');
      }

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.account, 'latest'],
      });

      // Convert from wei to ETH
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
      return {
        success: true,
        balance: balanceInEth,
        balanceWei: balance,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Sign a message
  async signMessage(message) {
    try {
      if (!this.account) {
        throw new Error('No account connected');
      }

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, this.account],
      });

      return {
        success: true,
        signature,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Send a transaction
  async sendTransaction(transaction) {
    try {
      if (!this.account) {
        throw new Error('No account connected');
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: !!this.account,
      account: this.account,
      chainId: this.chainId,
      isMetaMaskInstalled: this.isMetaMaskInstalled(),
    };
  }

  // Format address for display
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Copy address to clipboard
  async copyAddress() {
    try {
      if (!this.account) {
        throw new Error('No account connected');
      }
      await navigator.clipboard.writeText(this.account);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get contract addresses
  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }

  // Get network information
  getNetworkInfo() {
    return CONTRACT_ADDRESSES.NETWORK;
  }
}

// Create and export a singleton instance
const walletService = new WalletService();
export default walletService;