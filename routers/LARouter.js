const express = require('express');
const router = express.Router();
const LAController = require('../controllers/LAController');

/////Learning Analytics
router.post('/LearningOutcomeAnalysis', LAController.LearningOutcomeAnalysis);
router.post('/ActivityAnalysis', LAController.ActivityAnalysis);
router.post('/ActivityAvgAnalysis', LAController.ActivityAvgAnalysis);

module.exports = router;
