const express = require('express');
const router = express.Router();
const testapi = require('../controllers/testapi.js');
const JWT = require('../utils/utils.js');
const login = require('../services/login.js');
const middleware = require('../utils/middleWare.js');

//testAPI
router.get('/test/getUserInfoTest/:user_id', testapi.getUserInfoTest);
router.get('/test/getInterTourTest/:user_id', testapi.getInterTourTest);
router.get('/test/getTourTest', testapi.getTourTest);
router.get('/test/getUserLocationTest/:user_id', testapi.getUserLocationTest);

//login
router.get('/kakao/code',login.kakaoLogin);

//JWT 실험
router.get('/JWTtest/getUserInfo', middleware.authToken, testapi.JWTgetUserInfoTest);



module.exports = router;