const aiService = require('../services/aiService');

const aiController = {
  // Get AI trade suggestions for a user
  async getTradeSuggestions(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const suggestions = await aiService.getTradeSuggestions(address);
      
      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      console.error('Error getting trade suggestions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get dynamic pricing data
  async getDynamicPricing(req, res) {
    try {
      const { period = '24h' } = req.query;
      
      const pricingData = await aiService.getDynamicPricing(period);
      
      res.json({
        success: true,
        data: pricingData
      });
    } catch (error) {
      console.error('Error getting dynamic pricing:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Predict energy demand
  async predictEnergyDemand(req, res) {
    try {
      const { location, timeframe = '24h' } = req.body;
      
      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }

      const prediction = await aiService.predictEnergyDemand(location, timeframe);
      
      res.json({
        success: true,
        data: prediction
      });
    } catch (error) {
      console.error('Error predicting energy demand:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get investment recommendations
  async getInvestmentRecommendations(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const recommendations = await aiService.getInvestmentRecommendations(address);
      
      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting investment recommendations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = aiController;