const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/TopicLO', loadController.LoadCourseLO);
router.get('/CourseName', loadController.LoadCourseName);
router.post('/getTopicByCourse', loadController.getTopicByCourse);
router.post('/getActivityByCourse', loadController.getActivityByCourse);
router.post('/loadLearnerByActivity', loadController.loadLearnerByActivity);
router.post('/loadLearnerByCourse', loadController.loadLearnerByCourse);

module.exports = router;
