const express = require('express');
const router = express.Router();
const { enhancePrompt } = require('../controllers/enhanceController');

// Define valid options for validation
const VALID_CATEGORIES = [
  'Coding',
  'UI/UX',
  'Marketing',
  'Content Writing',
  'Business',
  'Startup Ideas',
  'Image Generation',
  'Resume Building'
];

const VALID_LEVELS = ['Basic', 'Professional', 'Expert'];

// POST /api/enhance
router.post('/', (req, res, next) => {
  const { prompt, category, level } = req.body;

  // 1. Validation: Ensure all fields are present
  if (prompt === undefined || category === undefined || level === undefined) {
    return res.status(400).json({
      error: 'Missing required fields. Request body must include prompt, category, and level.'
    });
  }

  // 2. Validation: Prompt cannot be empty
  if (typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({
      error: 'Prompt must be a non-empty string.'
    });
  }

  // 3. Validation: Verify Category
  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
    });
  }

  // 4. Validation: Verify Level
  if (!VALID_LEVELS.includes(level)) {
    return res.status(400).json({
      error: `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`
    });
  }

  // Pass control to controller
  enhancePrompt(req, res, next);
});

module.exports = router;
