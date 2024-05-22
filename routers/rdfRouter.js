const express = require('express');
const router = express.Router();
const rdfController = require('../controllers/rdfController');

router.post('/Learner-Activity', rdfController.Learner);

module.exports = router;
