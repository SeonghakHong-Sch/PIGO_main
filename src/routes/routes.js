const express = require('express');
const router = express.Router();
const testapi = require('../controllers/testapi.js');
const userInfo=require('../controllers/userInfoController.js');
const interTour = require('../controllers/interTourController.js');
const visitedTour = require('../controllers/visitedTourController.js');
const recommend = require('../controllers/recommendController.js');
const Tour = require('../controllers/tourTBController.js');
const analytics = require('../controllers/statisticsController.js');
const login = require('../services/login.js');
const middleware = require('../utils/middleWare.js');
const review = require('../controllers/reviewController.js');
const likes = require('../controllers/likeController.js');


//유저 관련 API
router.get('/user/getUserInfo',middleware.authToken,userInfo.getUserInfo);
router.post('/user/setUserInfo',middleware.authToken,userInfo.setUserInfo);


//관광지 관련 API
router.post('/tour/inputTour', Tour.inputTour);
router.post('/tour/getTour', Tour.getTour);

//관심 관광지 관련 API
router.get('/tour/getInterTour', middleware.authToken, interTour.getInterTour);
router.post('/tour/setInterTour', middleware.authToken, interTour.setInterTour);


//방문지 관련 API
router.get('/tour/getVisitedTour', middleware.authToken, visitedTour.getVisitedTour);
router.post('/tour/setVisitedTour', middleware.authToken, visitedTour.setVisitedTour);

//추천관련 API
router.post('/recommend/getRecommendTour', middleware.authToken, recommend.tourRecommend);
router.get('/recommend/getRandomTour', recommend.tourRandom);
router.post('/recommend/getRecommendPlan', middleware.authToken, recommend.planRecommend);

//핫플 조회
router.get('/tour/getHotplace/:order_by', analytics.getHotplace);

//login
router.get('/kakao/code',login.kakaoLogin);
//quit
router.post('/quit',middleware.authToken,login.quit);

//리뷰 관련 API
router.post('/review/write',middleware.authToken,review.writeReview);
router.post('/review/edit',middleware.authToken,review.editReview);
router.post('/review/delete',middleware.authToken,review.deleteReview);
router.get('/review/get',review.getReview);

//좋아요 관련 API
router.post('/likes/like',middleware.authToken,likes.like);
router.post('/likes/dislike',middleware.authToken,likes.dislike);
router.get('/likes/get',likes.getlikes);


//testAPI
router.get('/test/getUserInfoTest/:user_id', testapi.getUserInfoTest);
router.get('/test/getInterTourTest/:user_id', testapi.getInterTourTest);
router.get('/test/getTourTest', testapi.getTourTest);
router.get('/test/getUserLocationTest/:user_id', testapi.getUserLocationTest);
router.get('/JWTtest/getUserInfo', middleware.authToken, testapi.JWTgetUserInfoTest);


module.exports = router;