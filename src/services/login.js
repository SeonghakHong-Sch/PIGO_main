const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios');
const JWTToken = require('../utils/utils.js');
const connection=require('../config/db.js');
const dbaccess=require('./dbAccess.js');

const kakao = { //환경변수 불러옴
    clientID: process.env.KAKAO_REST_API_KEY,
    redirectURI: process.env.KAKAO_REDIRECT_URI
};

exports.kakaoLogin = async (req, res) => { //프론트에서 로그인 시 kakao/code로 redirect됨
    const authcode = req.query.code;
    let token;
    try {
        const tokenResponse = await axios.post( //token 받아오기
            "https://kauth.kakao.com/oauth/token",
            qs.stringify({
                grant_type: "authorization_code",
                client_id: kakao.clientID,
                redirect_uri: kakao.redirectURI,
                code: authcode
            }),
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                }
            }
        );
        token = tokenResponse.data;
    } catch (e) {
        console.log(e);
        return res.status(500).json(e.response ? e.response.data : e.message);
    }

    let user;
    try { //유저 정보 받아오기
        const userResponse = await axios({
            method: "GET",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${token.access_token}`,
            },
        });
        user = userResponse.data;
    } catch (e) {
        console.log(e);
        return res.status(500).json(e.response ? e.response.data : e.message);
    }

    //user.data 이용해서 뭔가뭔가 하기
    console.log(user);
    dbaccess.haveUser(connection,user.id)
        .then((exists)=>{
            if(!exists){
                //db에 집어넣기
                console.log('not exist!');
            }
        });

    const JWT = JWTToken.issueJWT(user);
    console.log(JWT);
    res.json({ //토큰이랑 유저데이터 response
        PIGO_token: JWT,
        user
    });
};
