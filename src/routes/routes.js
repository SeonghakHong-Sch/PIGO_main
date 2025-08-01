const express = require('express');
const router = express.Router();
const testapi = require('../controllers/testapi.js');
const userInfo=require('../controllers/userInfoController.js');
const interTour = require('../controllers/interTourController.js');
const visitedTour = require('../controllers/visitedTourController.js');
const login = require('../services/login.js');
const middleware = require('../utils/middleWare.js');


//유저 관련 API
router.get('/user/getUserInfo',middleware.authToken,userInfo.getUserInfo);
router.post('/user/setUserInfo',middleware.authToken,userInfo.setUserInfo);


//관광지 관련 API
router.get('/tour/getInterTour', middleware.authToken, interTour.getInterTour);
router.post('/tour/setInterTour', middleware.authToken, interTour.setInterTour);


//방문지 관련 API
router.get('/tour/getVisitedTour', middleware.authToken, visitedTour.getVisitedTour);
router.post('/tour/setVisitedTour', middleware.authToken, visitedTour.setVisitedTour);


//login
router.get('/kakao/code',login.kakaoLogin);


//testAPI
router.get('/test/getUserInfoTest/:user_id', testapi.getUserInfoTest);
router.get('/test/getInterTourTest/:user_id', testapi.getInterTourTest);
router.get('/test/getTourTest', testapi.getTourTest);
router.get('/test/getUserLocationTest/:user_id', testapi.getUserLocationTest);
router.get('/JWTtest/getUserInfo', middleware.authToken, testapi.JWTgetUserInfoTest);


module.exports = router;