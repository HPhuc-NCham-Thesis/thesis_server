const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadController');

router.get('/getCourseName', loadController.getCourseName);//Lấy tên môn học //2 3 4 6 7 //LA 1
router.post('/getActivityByCourse', loadController.getActivityByCourse);//Lấy hoạt động theo môn học //5 //6
router.get('/getListTopic', loadController.getListTopic);//Lấy danh sách Topic //1
router.post('/getLevelByTopic', loadController.getLevelByTopic);//Lấy danh sách level theo Topic //1 4 8
router.post('/getTopicByCourse', loadController.getTopicByCourse);//Lấy danh sách Topic thuộc Course //3 4 8
router.post('/getLearnerByCourse', loadController.getLearnerByCourse);  //Lấy danh sách Learner tham gia Course //6 7
router.post('/getGroupByCourse', loadController.getGroupByCourse);//Lấy danh sách các group có tham gia course //LA 1

module.exports = router;
