const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI suggestion routes
router.get('/suggestions/:address', aiController.getTradeSuggestions);
router.get('/pricing', aiController.getDynamicPricing);
router.post('/predict', aiController.predictEnergyDemand);
router.get('/recommendations/:address', aiController.getInvestmentRecommendations);

module.exports = router;