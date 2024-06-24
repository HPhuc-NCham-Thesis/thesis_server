const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/TopicLO', loadController.LoadTopicLO);
router.get('/CourseName', loadController.LoadCourseName);////Lấy tên môn học
router.post('/getTopicByCourse', loadController.getTopicByCourse);
router.post('/getActivityByCourse', loadController.getActivityByCourse);//Lấy hoạt động theo môn học
router.post('/loadLearnerByActivity', loadController.loadLearnerByActivity);
router.post('/loadLearnerByCourse', loadController.loadLearnerByCourse);
//Lấy danh sách các group có tham gia course
router.post('/getGroupByCourse', loadController.getGroupByCourse);
module.exports = router;
