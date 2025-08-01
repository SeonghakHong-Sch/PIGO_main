//JWT 토큰 인증, 발급
const JWT = require('jsonwebtoken');

exports.issueJWT = (user) => {
    const payload = {
        user_id: user.id,
        user_name: user.properties.nickname
    };
    const options = {
        expiresIn: '1h', //토큰 유효시간
        issuer: 'PIGO_Main'
    };
    //토큰 생성 & 반환
    console.log('JWT 토큰 생성');
    console.log(process.env.JWT_SECRET_KEY)
    return JWT.sign(payload, process.env.JWT_SECRET_KEY, options);
}