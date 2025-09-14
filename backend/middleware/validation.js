// Input validation middleware
const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const validationRules = {
  // Wallet address validation
  walletAddress: param('address')
    .isEthereumAddress()
    .withMessage('Invalid Ethereum address format')
    .isLength({ min: 42, max: 42 })
    .withMessage('Address must be exactly 42 characters'),

  // User profile validation
  userProfile: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('location')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Location must be between 2 and 100 characters'),
    
    body('userType')
      .optional()
      .isIn(['consumer', 'producer', 'both'])
      .withMessage('User type must be consumer, producer, or both')
  ],

  // Trade offer validation
  tradeOffer: [
    body('seller')
      .isEthereumAddress()
      .withMessage('Invalid seller address'),
    
    body('amount')
      .isNumeric()
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive number greater than 0.01'),
    
    body('pricePerToken')
      .isNumeric()
      .isFloat({ min: 0.000001 })
      .withMessage('Price per token must be a positive number'),
    
    body('location')
      .isLength({ min: 2, max: 100 })
      .withMessage('Location must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s,.-]+$/)
      .withMessage('Location contains invalid characters')
  ],

  // Token purchase validation
  tokenPurchase: [
    body('buyer')
      .isEthereumAddress()
      .withMessage('Invalid buyer address'),
    
    body('offerId')
      .isInt({ min: 0 })
      .withMessage('Offer ID must be a non-negative integer'),
    
    body('amount')
      .isNumeric()
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive number greater than 0.01')
  ],

  // Energy simulation validation
  energySimulation: [
    body('address')
      .isEthereumAddress()
      .withMessage('Invalid address format'),
    
    body('duration')
      .optional()
      .isInt({ min: 1, max: 168 })
      .withMessage('Duration must be between 1 and 168 hours')
  ],

  // Query parameter validation
  pagination: [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a non-negative integer')
  ],

  // Period validation
  period: query('period')
    .optional()
    .isIn(['1h', '24h', '7d', '30d'])
    .withMessage('Period must be 1h, 24h, 7d, or 30d')
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS attempts
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  };

  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  next();
};

// Rate limiting helper
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Check current requests
    const userRequests = Array.from(requests.entries())
      .filter(([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart)
      .length;
    
    if (userRequests >= max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    requests.set(`${ip}-${now}`, now);
    next();
  };
};

module.exports = {
  validationRules,
  handleValidationErrors,
  sanitizeInput,
  createRateLimit
};