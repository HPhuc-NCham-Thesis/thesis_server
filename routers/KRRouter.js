const express = require('express');
const router = express.Router();
const KRController = require('../controllers/KRController');


router.post('/getCourseAchieveLOOfTopic', KRController.getCourseAchieveLOOfTopic);
router.post('/getLOAndTopicForCourse', KRController.getLOAndTopicForCourse); 
router.post('/getLevelNeedAchieveForTopic', KRController.getLevelNeedAchieveForTopic);
router.post('/getActivityNeedAchieveLOOfTopic', KRController.getActivityNeedAchieveLOOfTopic);
router.post('/getLearnerAchievesLOAndTopic', KRController.getLearnerAchievesLOAndTopic);
router.post('/getAssessmentForLearner', KRController.getAssessmentForLearner); 
router.post('/getLOLearnerAchievesInCourse', KRController.getLOLearnerAchievesInCourse);
router.post('/getLearnerAchievesLOOfTopic', KRController.getLearnerAchievesLOOfTopic);
module.exports = router;
