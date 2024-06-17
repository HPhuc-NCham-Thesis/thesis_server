const express = require('express');
const router = express.Router();
const rdfController = require('../controllers/rdfController');

router.post('/Learner-Activity', rdfController.Learner);
router.post('/LearneringOutcome-Learner', rdfController.Learning_Outcome);
router.post('/LearningOutcome-Topic', rdfController.LearningOutcome_Topic);
router.post('/ActivityResult', rdfController.ActivityResult);
router.post('/Topic-LearningOutcome', rdfController.Topic_LearningOutcome);
router.post('/Level-LearningOutcome', rdfController.Level_LearningOutcome);
router.post('/SubTopic', rdfController.SubTopic);
router.post('/CourseLOTopic', rdfController.CourseLOTopic);
router.post('/LOTopicCourse', rdfController.LOTopicCourse); //chờ fix
router.post('/Course', rdfController.Course);

router.post('/SubTopic', rdfController.SubTopicOfTopic);
module.exports = router;
