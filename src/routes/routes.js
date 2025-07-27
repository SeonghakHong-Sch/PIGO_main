const express = require('express');
const router = express.Router();
const testapi = require('../controllers/testapi.js');
const login=require('../services/login.js');

//testAPI
router.get('/test/getUserInfoTest/:user_id', testapi.getUserInfoTest);
router.get('/test/getInterTourTest/:user_id', testapi.getInterTourTest);
router.get('/test/getTourTest', testapi.getTourTest);
router.get('/test/getUserLocationTest/:user_id', testapi.getUserLocationTest);

router.get('/kakao/code',login.kakaoLogin);



module.exports = router;