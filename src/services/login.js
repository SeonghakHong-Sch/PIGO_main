const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios');
const JWTToken = require('../utils/utils.js');
const connection = require('../config/db.js');
const dbaccess = require('./dbAccess.js');

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
        return res.status(500).json({ message: '토큰 발급 실패', error: e });
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
        console.log('카카오 토큰으로 유저 정보 받아오기 실패', e);
        return res.status(500).json({ message: '카카오 토큰으로 유저 정보 받아오기 실패', error: e });
    }
    let existing;
    //user.data 이용해서 뭔가뭔가 하기
    try {
        dbaccess.haveUser(connection, user.id)
            .then((exists) => {
                if (!exists) {
                    existing = false;
                    //db에 집어넣기
                    try {
                        dbaccess.register(connection, user);
                    } catch (e) {
                        console.log('유저 삽입 오류', e);
                        return res.status(500).json({ message: '유저 삽입 오류', error: e });
                    }
                    console.log('user register : ', user.id);
                }
                else {
                    existing = true;
                    console.log('user db에 존재 : ', user.id);
                }
            });
    } catch (e) {
        console.log('유저 조회 존재 확인 불가', e);
        return res.status(500).json({ message: '유저 존재 확인 불가', error: e });
    }

    const JWT = JWTToken.issueJWT(user);
    res.json({ //토큰이랑 유저데이터 response
        PIGO_token: JWT,
        user,
        "existing": existing
    });
};

exports.quit = async (req, res) => {
    const user = req.user;
    const userID = user.user_id;

    let errorList = [];
    if (!(await dbaccess.deleteLikesByUserId(userID))) {
        errorList.push('Likes');
    }
    if (!(await dbaccess.deleteReviewByUserId(userID))) {
        errorList.push('Review');
    }
    if (!(await dbaccess.deleteIntertourByUserId(userID))) {
        errorList.push('InterTour');
    }
    if (!(await dbaccess.deleteInterLocationByUserId(userID))) {
        errorList.push('InterLocation');
    }
    if (!(await dbaccess.deleteVisitedTourByUserId(userID))) {
        errorList.push('VisitedTour');
    }
    if (errorList.length != 0) {
        console.log('회원탈퇴 중 오류',errorList);
        return res.status(500).json({ message: '회원탈퇴 중 오류', errors_in: errorList });
    }
    else {
        try {
            const result = await dbaccess.deleteUser(userID);
            return res.status(200).json({ message: '회원탈퇴 성공', changedRows: result.changedRows });
        } catch (err) {
            return res.status(500).json({ message: '회원 탈퇴 유저삭제 오류', error: err });
        }
    }
}