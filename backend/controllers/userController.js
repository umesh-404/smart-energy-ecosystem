const userModel = require('../models/userModel');

const userController = {
  // Get user profile by wallet address
  async getUserProfile(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const user = await userModel.getUserByAddress(address);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new user profile
  async createUserProfile(req, res) {
    try {
      const { address, name, email, location, userType } = req.body;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const userData = {
        address,
        name: name || 'Anonymous User',
        email: email || null,
        location: location || 'Unknown',
        userType: userType || 'consumer', // consumer, producer, both
        createdAt: new Date(),
        isActive: true
      };

      const user = await userModel.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'User profile created successfully'
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update user profile
  async updateUserProfile(req, res) {
    try {
      const { address } = req.params;
      const updateData = req.body;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const user = await userModel.updateUser(address, updateData);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: user,
        message: 'User profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get user statistics
  async getUserStats(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const stats = await userModel.getUserStats(address);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting user stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController;