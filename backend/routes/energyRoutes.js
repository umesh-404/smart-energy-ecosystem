const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energyController');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

// Energy data routes
router.get('/generation/:address', 
  validationRules.walletAddress,
  validationRules.period, 
  handleValidationErrors, 
  energyController.getEnergyGeneration
);

router.get('/consumption/:address', 
  validationRules.walletAddress,
  validationRules.period, 
  handleValidationErrors, 
  energyController.getEnergyConsumption
);

router.post('/simulate', 
  validationRules.energySimulation, 
  handleValidationErrors, 
  energyController.simulateEnergyData
);

router.get('/battery/:address', 
  validationRules.walletAddress, 
  handleValidationErrors, 
  energyController.getBatteryStatus
);

router.get('/carbon-credits/:address', 
  validationRules.walletAddress, 
  handleValidationErrors, 
  energyController.getCarbonCredits
);

module.exports = router;