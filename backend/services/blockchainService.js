const { ethers } = require('ethers');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.energyTokenContract = null;
    this.tradeManagerContract = null;
    this.compensationManagerContract = null;
    this.initializeContracts();
  }

  async initializeContracts() {
    try {
      // Initialize provider (use Mumbai testnet for development)
      this.provider = new ethers.JsonRpcProvider(
        process.env.MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com'
      );

      // Contract addresses from deployment
      const ENERGY_TOKEN_ADDRESS = process.env.ENERGY_TOKEN_ADDRESS || "0x1234567890123456789012345678901234567890";
      const TRADE_MANAGER_ADDRESS = process.env.TRADE_MANAGER_ADDRESS || "0x2345678901234567890123456789012345678901";
      const COMPENSATION_MANAGER_ADDRESS = process.env.COMPENSATION_MANAGER_ADDRESS || "0x3456789012345678901234567890123456789012";

      // Contract ABIs (simplified for demo)
      const energyTokenABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function transfer(address to, uint256 amount) returns (bool)',
        'function mintEnergyTokens(address to, uint256 energyAmount) external',
        'function burnEnergyTokens(address from, uint256 energyAmount) external'
      ];

      const tradeManagerABI = [
        'function executeTrade(uint256 offerId) external payable',
        'function createTradeOffer(uint256 amount, uint256 pricePerToken, string memory location) external',
        'function getActiveOffers() view returns (tuple(address seller, uint256 amount, uint256 pricePerToken, string location, bool isActive, uint256 timestamp)[])',
        'function getMarketplaceStats() view returns (uint256, uint256, uint256)'
      ];

      const compensationManagerABI = [
        'function claimCompensation(uint256 outageId) external',
        'function getPendingCompensations(address user) view returns (tuple(address user, uint256 outageId, uint256 amount, bool claimed, uint256 timestamp)[])',
        'function getOutageStats() view returns (uint256, uint256, uint256)'
      ];

      // Initialize contracts
      if (ENERGY_TOKEN_ADDRESS) {
        this.energyTokenContract = new ethers.Contract(
          ENERGY_TOKEN_ADDRESS,
          energyTokenABI,
          this.provider
        );
      }

      if (TRADE_MANAGER_ADDRESS) {
        this.tradeManagerContract = new ethers.Contract(
          TRADE_MANAGER_ADDRESS,
          tradeManagerABI,
          this.provider
        );
      }

      if (COMPENSATION_MANAGER_ADDRESS) {
        this.compensationManagerContract = new ethers.Contract(
          COMPENSATION_MANAGER_ADDRESS,
          compensationManagerABI,
          this.provider
        );
      }

      console.log('✅ Blockchain service initialized');
    } catch (error) {
      console.error('❌ Error initializing blockchain service:', error);
    }
  }

  // Get token balance for an address
  async getTokenBalance(address) {
    try {
      if (!this.energyTokenContract) {
        console.log('⚠️ EnergyToken contract not initialized, using mock data');
        return '1250000000000000000000'; // 1250 ET in wei format
      }

      // Call the actual smart contract
      const balance = await this.energyTokenContract.balanceOf(address);
      console.log(`📊 Token balance for ${address}: ${balance.toString()}`);
      return balance.toString();
    } catch (error) {
      console.error('Error getting token balance from contract:', error);
      // Fallback to mock data if contract call fails
      return '1250000000000000000000';
    }
  }

  // Execute a trade
  async executeTrade(buyerAddress, offerId, amount) {
    try {
      if (!this.tradeManagerContract) {
        console.log('⚠️ TradeManager contract not initialized, using mock transaction');
        return {
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 'pending',
          message: 'Mock transaction - contract not deployed'
        };
      }

      // In a real implementation, this would require a signer with private key
      // For SIH demo, we'll simulate the transaction
      console.log(`🔄 Simulating trade execution: Buyer ${buyerAddress}, Offer ${offerId}, Amount ${amount}`);
      
      // Simulate blockchain transaction
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      console.log(`✅ Trade executed with hash: ${mockTxHash}`);
      
      return {
        hash: mockTxHash,
        status: 'success',
        message: 'Trade executed successfully (simulated)',
        gasUsed: '21000',
        blockNumber: Math.floor(Math.random() * 1000000) + 50000000
      };
    } catch (error) {
      console.error('Error executing trade:', error);
      throw error;
    }
  }

  // Claim compensation
  async claimCompensation(userAddress, outageId) {
    try {
      if (!this.compensationManagerContract) {
        console.log('⚠️ CompensationManager contract not initialized, using mock transaction');
        return {
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          status: 'pending',
          message: 'Mock transaction - contract not deployed'
        };
      }

      // Simulate compensation claim
      console.log(`🔄 Simulating compensation claim: User ${userAddress}, Outage ${outageId}`);
      
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      console.log(`✅ Compensation claimed with hash: ${mockTxHash}`);
      
      return {
        hash: mockTxHash,
        status: 'success',
        message: 'Compensation claimed successfully (simulated)',
        gasUsed: '15000',
        blockNumber: Math.floor(Math.random() * 1000000) + 50000000
      };
    } catch (error) {
      console.error('Error claiming compensation:', error);
      throw error;
    }
  }

  // Get active trade offers
  async getActiveOffers() {
    try {
      if (!this.tradeManagerContract) {
        console.log('⚠️ TradeManager contract not initialized, using mock offers');
        return [
          {
            seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            amount: ethers.parseEther('100'),
            pricePerToken: ethers.parseEther('0.05'),
            location: 'Mumbai, India',
            isActive: true,
            timestamp: Math.floor(Date.now() / 1000)
          }
        ];
      }

      console.log('📡 Fetching active offers from blockchain...');
      const offers = await this.tradeManagerContract.getActiveOffers();
      console.log(`✅ Retrieved ${offers.length} active offers from blockchain`);
      return offers;
    } catch (error) {
      console.error('Error getting active offers from contract:', error);
      // Fallback to mock data
      return [
        {
          seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          amount: ethers.parseEther('100'),
          pricePerToken: ethers.parseEther('0.05'),
          location: 'Mumbai, India',
          isActive: true,
          timestamp: Math.floor(Date.now() / 1000)
        }
      ];
    }
  }

  // Get marketplace statistics
  async getMarketplaceStats() {
    try {
      if (!this.tradeManagerContract) {
        // Return mock data for development
        return {
          totalOffers: 15,
          totalTrades: 127,
          totalVolume: ethers.parseEther('43.4')
        };
      }

      const [totalOffers, totalTrades, totalVolume] = await this.tradeManagerContract.getMarketplaceStats();
      return {
        totalOffers: totalOffers.toString(),
        totalTrades: totalTrades.toString(),
        totalVolume: totalVolume.toString()
      };
    } catch (error) {
      console.error('Error getting marketplace stats:', error);
      throw error;
    }
  }
}

module.exports = new BlockchainService();