const tokenModel = require('../models/tokenModel');
const blockchainService = require('../services/blockchainService');

const tokenController = {
  // Get token balance for a user
  async getTokenBalance(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const balance = await blockchainService.getTokenBalance(address);
      
      res.json({
        success: true,
        data: {
          address,
          balance: balance.toString(),
          balanceFormatted: parseFloat((balance / 1e18).toFixed(2))
        }
      });
    } catch (error) {
      console.error('Error getting token balance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all trade offers
  async getTradeOffers(req, res) {
    try {
      const { location, minPrice, maxPrice, sortBy = 'timestamp' } = req.query;
      
      const offers = await tokenModel.getTradeOffers({
        location,
        minPrice,
        maxPrice,
        sortBy
      });
      
      res.json({
        success: true,
        data: offers
      });
    } catch (error) {
      console.error('Error getting trade offers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create a new trade offer
  async createTradeOffer(req, res) {
    try {
      const { seller, amount, pricePerToken, location } = req.body;
      
      if (!seller || !amount || !pricePerToken || !location) {
        return res.status(400).json({ 
          error: 'Missing required fields: seller, amount, pricePerToken, location' 
        });
      }

      const offer = await tokenModel.createTradeOffer({
        seller,
        amount,
        pricePerToken,
        location,
        timestamp: new Date()
      });
      
      res.status(201).json({
        success: true,
        data: offer,
        message: 'Trade offer created successfully'
      });
    } catch (error) {
      console.error('Error creating trade offer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Buy tokens from an offer
  async buyTokens(req, res) {
    try {
      console.log('Raw request body:', req.body);
      console.log('Request body type:', typeof req.body);
      console.log('Request body keys:', Object.keys(req.body || {}));
      const { buyer, offerId, amount } = req.body;
      
      if (!buyer || !offerId || !amount) {
        console.log('Missing fields - buyer:', buyer, 'offerId:', offerId, 'amount:', amount);
        return res.status(400).json({ 
          error: 'Missing required fields: buyer, offerId, amount' 
        });
      }

      const transaction = await blockchainService.executeTrade(buyer, offerId, amount);
      
      res.json({
        success: true,
        data: transaction,
        message: 'Token purchase initiated'
      });
    } catch (error) {
      console.error('Error buying tokens:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get transaction history for a user
  async getTransactionHistory(req, res) {
    try {
      const { address } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const transactions = await tokenModel.getTransactionHistory(address, limit, offset);
      
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      console.error('Error getting transaction history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get marketplace statistics
  async getMarketplaceStats(req, res) {
    try {
      const stats = await tokenModel.getMarketplaceStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting marketplace stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get pending compensations for a user
  async getPendingCompensations(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const compensations = await tokenModel.getPendingCompensations(address);
      
      res.json({
        success: true,
        data: compensations
      });
    } catch (error) {
      console.error('Error getting pending compensations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Claim compensation
  async claimCompensation(req, res) {
    try {
      const { address, outageId } = req.body;
      
      if (!address || !outageId) {
        return res.status(400).json({ 
          error: 'Missing required fields: address, outageId' 
        });
      }

      const transaction = await blockchainService.claimCompensation(address, outageId);
      
      res.json({
        success: true,
        data: transaction,
        message: 'Compensation claim initiated'
      });
    } catch (error) {
      console.error('Error claiming compensation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = tokenController;