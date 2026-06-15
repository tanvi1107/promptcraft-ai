require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const enhanceRouter = require('./routes/enhance');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow requests from custom client URL or all during development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Primary enhancement route
app.use('/api/enhance', enhanceRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An internal server error occurred.',
      status: err.status || 500
    }
  });
});

app.listen(PORT, () => {
  console.log(`AI Prompt Enhancer Backend listening on port ${PORT}`);
});
console.log("Gemini Key:", process.env.GEMINI_API_KEY);