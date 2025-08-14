const JWT = require('jsonwebtoken');

exports.authToken = (req, res, next) => {
    console.log('미들웨어');
    const authHead = req.headers['authorization'];
    if (!authHead) {
        return res.status(401).json({message: '토큰 넣어주세요'});
    }

    const PIGO_token = authHead.split(' ')[1];
    console.log(authHead);
    JWT.verify(PIGO_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({message: '토큰 에러'});
        }
        req.user = decoded;
        console.log(req.user);
        
        next();
    })
}