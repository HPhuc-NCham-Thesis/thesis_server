const express = require('express');
const router = express.Router();
const KRController = require('../controllers/KRController');

// router.post('/Learner-Activity', KRController.Learner);
// router.post('/LearneringOutcome-Learner', KRController.Learning_Outcome);
// router.post('/LearningOutcome-Topic', KRController.LearningOutcome_Topic);
// router.post('/ActivityResult', KRController.ActivityResult);
// router.post('/Level-LearningOutcome', KRController.Level_LearningOutcome);
// router.post('/SubTopic', KRController.SubTopic);
// router.post('/LOTopicCourse', KRController.LOTopicCourse); //chờ fix
// router.post('/Course', KRController.Course);
// router.post('/SubTopic', KRController.SubTopicOfTopic);

router.post('/getCourseAchieveLOOfTopic', KRController.getCourseAchieveLOOfTopic);
router.post('/getLOAndTopicForCourse', KRController.getLOAndTopicForCourse); 
router.post('/getLevelNeedAchieveForTopic', KRController.getLevelNeedAchieveForTopic);
router.post('/getActivityNeedAchieveLOOfTopic', KRController.getActivityNeedAchieveLOOfTopic);
router.post('/getLearnerAchievesLOAndTopic', KRController.getLearnerAchievesLOAndTopic);
router.post('/getAssessmentForLearner', KRController.getAssessmentForLearner); 
router.post('/getLOLearnerAchievesInCourse', KRController.getLOLearnerAchievesInCourse);
router.post('/getLearnerAchievesLOOfTopic', KRController.getLearnerAchievesLOOfTopic);
module.exports = router;
