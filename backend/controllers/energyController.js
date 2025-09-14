const energyModel = require('../models/energyModel');

const energyController = {
  // Get energy generation data for a user
  async getEnergyGeneration(req, res) {
    try {
      const { address } = req.params;
      const { period = '24h' } = req.query;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const generationData = await energyModel.getEnergyGeneration(address, period);
      
      res.json({
        success: true,
        data: generationData
      });
    } catch (error) {
      console.error('Error getting energy generation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get energy consumption data for a user
  async getEnergyConsumption(req, res) {
    try {
      const { address } = req.params;
      const { period = '24h' } = req.query;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const consumptionData = await energyModel.getEnergyConsumption(address, period);
      
      res.json({
        success: true,
        data: consumptionData
      });
    } catch (error) {
      console.error('Error getting energy consumption:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Simulate energy data (for demo purposes)
  async simulateEnergyData(req, res) {
    try {
      const { address, duration = 24 } = req.body;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const simulationData = await energyModel.generateSimulationData(address, duration);
      
      res.json({
        success: true,
        data: simulationData,
        message: 'Energy simulation started'
      });
    } catch (error) {
      console.error('Error simulating energy data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get battery status
  async getBatteryStatus(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const batteryStatus = await energyModel.getBatteryStatus(address);
      
      res.json({
        success: true,
        data: batteryStatus
      });
    } catch (error) {
      console.error('Error getting battery status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get carbon credits earned
  async getCarbonCredits(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const carbonCredits = await energyModel.getCarbonCredits(address);
      
      res.json({
        success: true,
        data: carbonCredits
      });
    } catch (error) {
      console.error('Error getting carbon credits:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = energyController;