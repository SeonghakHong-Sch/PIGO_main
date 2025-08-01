const db = require('../config/db.js');

exports.getUserInfoTest = (req, res) => {
    const userId = req.params.user_id;
    if (!userId) {
        return res.status(400).json({error: '유저 인덱스 쳐 넣으셈'})
    }

    db.query('SELECT * FROM UserTable WHERE user_id = ?;',[userId], (err, results) => {
        if (err) return res.status(500).json({error: err});
        res.json(results[0]);
    });
};

exports.getInterTourTest = (req, res) => {
    const userId = req.params.user_id;
    if (!userId) {
        return res.status(400).json({error: '유저 인덱스 쳐 넣으셈'})
    }

    db.query('SELECT * FROM InterTourTable WHERE user_id = ?;',[userId], (err, results) => {
        if (err) return res.status(500).json({error: err});
        res.json(results.map(item => item.tour_id));
    });
};

exports.getTourTest = (req, res) => {
    db.query('SELECT * FROM TourTable;', (err, results) => {
        if (err) return res.status(500).json({error: err});
        res.json(results);
    });
};

exports.getUserLocationTest = (req, res) => {
    const userId = req.params.user_id;
    if (!userId) {
        return res.status(400).json({error: '유저 인덱스 쳐 넣으셈'})
    }

    db.query('SELECT * FROM InterLocationTable WHERE user_id = ?;',[userId], (err, results) => {
        if (err) return res.status(500).json({error: err});
        res.json(results.map(item => ({
            lDongRegnCd: item.lDongRegnCd,
            lDongSignguCd: item.lDongSignguCd
        })));
    });
};

exports.JWTgetUserInfoTest = (req, res) => {
  const user = req.user; // JWT payload (예: { user_id, user_name ... })
  const userId = user.user_id; // JWT payload에서 추출 (발급 시 payload 값 참고)
  // userId로 사용자 정보 조회(또는 user 자체 활용 가능)
  console.log('인증됨')
  res.json({ message: '인증된 유저 요청', userId, user });
};