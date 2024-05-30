const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/CourseLO', loadController.LoadCourseLO);

module.exports = router;
