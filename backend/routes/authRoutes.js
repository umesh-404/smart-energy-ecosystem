const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules for authentication
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('walletAddress')
    .optional()
    .isEthereumAddress()
    .withMessage('Invalid Ethereum address format'),
  body('userType')
    .optional()
    .isIn(['consumer', 'producer', 'both'])
    .withMessage('User type must be consumer, producer, or both')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Authentication routes
router.post('/register', 
  registerValidation, 
  handleValidationErrors, 
  authController.register
);

router.post('/login', 
  loginValidation, 
  handleValidationErrors, 
  authController.login
);

router.post('/logout', 
  authenticateToken, 
  authController.logout
);

router.get('/verify', 
  authenticateToken, 
  authController.verifyToken
);

router.put('/profile', 
  authenticateToken,
  [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('location')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Location must be between 2 and 100 characters'),
    body('userType')
      .optional()
      .isIn(['consumer', 'producer', 'both'])
      .withMessage('User type must be consumer, producer, or both')
  ],
  handleValidationErrors,
  authController.updateProfile
);

router.put('/change-password', 
  authenticateToken,
  changePasswordValidation,
  handleValidationErrors,
  authController.changePassword
);

module.exports = router;