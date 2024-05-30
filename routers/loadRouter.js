const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/CourseLO', loadController.LoadCourseLO);
router.get('/CourseName', loadController.LoadCourseName);
router.post('/getTopicByCourse', loadController.getTopicByCourse);
router.post('/getActivityByCourse', loadController.getActivityByCourse);
router.post('/loadLearnerByActivity', loadController.loadLearnerByActivity);

module.exports = router;
