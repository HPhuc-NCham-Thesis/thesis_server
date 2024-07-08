const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/getCourseName', loadController.getCourseName);//Lấy tên môn học
router.post('/getTopicByCourse', loadController.getTopicByCourse);//Lấy danh sách Topic thuộc Course 
router.post('/getLearnerByGroupCourse', loadController.getLearnerByGroupCourse);  //Lấy danh sách Learner tham gia Course 
router.post('/getGroupByCourse', loadController.getGroupByCourse);//Lấy danh sách các group có tham gia course 
router.post('/getLearningOutcomeByCourse', loadController.getLearningOutcomeByCourse);
module.exports = router;
