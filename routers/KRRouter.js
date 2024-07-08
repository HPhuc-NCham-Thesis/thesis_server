const express = require('express');
const router = express.Router();
const KRController = require('../controllers/KRController');

//CourseReasoning
router.post('/getCourseInfoDefault', KRController.getCourseInfoDefault);
router.post('/getLearningGoalOfCourse', KRController.getLearningGoalOfCourse);
router.post('/getLearningOutcomeOfCourse', KRController.getLearningOutcomeOfCourse);
router.post('/getTopicOfCourse', KRController.getTopicOfCourse);
//TopicReasoning
router.post('/getTopicInfoDefault', KRController.getTopicInfoDefault);
router.post('/getActivityOfTopic', KRController.getActivityOfTopic);
//GroupReasoning
router.post('/getLearnerOfGroup', KRController.getLearnerOfGroup);
//LearnerReasoning
router.post('/getLearnerInfoDefault', KRController.getLearnerInfoDefault);
//LearningOutcomeReasoning
router.post('/getLearningOutcomeInfoDefault', KRController.getLearningOutcomeInfoDefault);
router.post('/getTopicOfLearningOutcome', KRController.getTopicOfLearningOutcome);
module.exports = router;
