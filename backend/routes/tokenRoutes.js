const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const tokenController = require('../controllers/tokenController');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

// Token trading routes
router.get('/balance/:address', 
  validationRules.walletAddress, 
  handleValidationErrors, 
  tokenController.getTokenBalance
);

router.get('/offers', 
  validationRules.pagination, 
  handleValidationErrors, 
  tokenController.getTradeOffers
);

router.post('/offers', 
  validationRules.tradeOffer, 
  handleValidationErrors, 
  tokenController.createTradeOffer
);

router.post('/buy', 
  // validationRules.tokenPurchase, 
  // handleValidationErrors, 
  tokenController.buyTokens
);

router.get('/transactions/:address', 
  validationRules.walletAddress,
  validationRules.pagination, 
  handleValidationErrors, 
  tokenController.getTransactionHistory
);

router.get('/marketplace/stats', tokenController.getMarketplaceStats);

// Compensation routes
router.get('/compensations/:address', 
  validationRules.walletAddress, 
  handleValidationErrors, 
  tokenController.getPendingCompensations
);

router.post('/compensations/claim', 
  [
    validationRules.walletAddress,
    body('outageId').isInt({ min: 0 }).withMessage('Invalid outage ID')
  ], 
  handleValidationErrors, 
  tokenController.claimCompensation
);

module.exports = router;