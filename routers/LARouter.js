const express = require('express');
const router = express.Router();
const LAController = require('../controllers/LAController');

/////Learning Analytics
router.post('/LOOfGroupAnalysis', LAController.LOOfGroupAnalysis);

module.exports = router;
