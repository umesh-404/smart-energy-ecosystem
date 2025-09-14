// Security configuration for Smart Energy Ecosystem
const securityConfig = {
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'X-API-Key',
      'X-Request-ID'
    ],
    exposedHeaders: ['X-Request-ID'],
    maxAge: 86400 // 24 hours
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: 15 * 60 // seconds
    },
    standardHeaders: true,
    legacyHeaders: false
  },

  // Input Validation Configuration
  validation: {
    maxStringLength: 1000,
    maxArrayLength: 100,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    sanitizeHtml: true,
    allowedHtmlTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    allowedHtmlAttributes: []
  },

  // Blockchain Security
  blockchain: {
    maxGasLimit: 1000000,
    maxGasPrice: '100000000000', // 100 gwei
    minConfirmations: 1,
    timeoutMs: 30000, // 30 seconds
    retryAttempts: 3,
    allowedNetworks: ['mumbai', 'polygon', 'localhost'],
    maxTransactionValue: '1000000000000000000000' // 1000 ETH in wei
  },

  // API Security
  api: {
    maxRequestSize: '10mb',
    maxUrlLength: 2048,
    maxHeaderSize: 8192,
    timeoutMs: 30000,
    enableCompression: true,
    enableHelmet: true,
    trustProxy: false
  },

  // Authentication & Authorization
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshTokenExpiresIn: '30d',
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    requireStrongPassword: true
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: true,
    enableErrorLogging: true,
    enableSecurityLogging: true,
    logSensitiveData: false,
    maxLogFileSize: '10MB',
    maxLogFiles: 5
  },

  // Environment-specific settings
  environment: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    enableDebugMode: process.env.DEBUG === 'true',
    enableVerboseLogging: process.env.VERBOSE === 'true'
  }
};

// Security headers configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
};

// Input sanitization patterns
const sanitizationPatterns = {
  // Remove potential XSS attempts
  xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  javascript: /javascript:/gi,
  onEvent: /on\w+\s*=/gi,
  
  // Remove SQL injection attempts
  sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
  
  // Remove path traversal attempts
  pathTraversal: /\.\.\//g,
  
  // Remove command injection attempts
  commandInjection: /[;&|`$()]/g,
  
  // Remove potential NoSQL injection
  nosqlInjection: /\$where|\$ne|\$gt|\$lt|\$regex/gi
};

// Validation schemas
const validationSchemas = {
  ethereumAddress: /^0x[a-fA-F0-9]{40}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  url: /^https?:\/\/.+/,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

// Security utilities
const securityUtils = {
  // Generate secure random string
  generateSecureToken: (length = 32) => {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  },

  // Hash sensitive data
  hashData: (data, salt = null) => {
    const crypto = require('crypto');
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512');
    return {
      hash: hash.toString('hex'),
      salt: actualSalt
    };
  },

  // Verify hashed data
  verifyHash: (data, hash, salt) => {
    const crypto = require('crypto');
    const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512');
    return verifyHash.toString('hex') === hash;
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    let sanitized = input;
    Object.values(sanitizationPatterns).forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized.trim();
  },

  // Validate input against schema
  validateInput: (input, schema) => {
    if (typeof schema === 'string' && validationSchemas[schema]) {
      return validationSchemas[schema].test(input);
    }
    if (schema instanceof RegExp) {
      return schema.test(input);
    }
    return false;
  }
};

module.exports = {
  securityConfig,
  securityHeaders,
  sanitizationPatterns,
  validationSchemas,
  securityUtils
};