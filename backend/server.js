const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sanitizeInput, createRateLimit } = require('./middleware/validation');
const { errorHandler, notFoundHandler, requestLogger } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(requestLogger);
app.use(sanitizeInput);
app.use(createRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/energy', require('./routes/energyRoutes'));
app.use('/api/tokens', require('./routes/tokenRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Smart Energy Ecosystem API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Smart Energy Ecosystem API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;