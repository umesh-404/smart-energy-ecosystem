const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

// User routes
router.get('/profile/:address', 
  validationRules.walletAddress, 
  handleValidationErrors, 
  userController.getUserProfile
);

router.post('/profile', 
  validationRules.userProfile, 
  handleValidationErrors, 
  userController.createUserProfile
);

router.put('/profile/:address', 
  validationRules.walletAddress,
  validationRules.userProfile, 
  handleValidationErrors, 
  userController.updateUserProfile
);

router.get('/stats/:address', 
  validationRules.walletAddress, 
  handleValidationErrors, 
  userController.getUserStats
);

module.exports = router;