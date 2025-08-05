const db = require('../config/db.js');

exports.getInterTour = (req, res) => {
    const user = req.user; // JWT payload ({ user_id, user_name ... })
    const userId = user.user_id; // JWT payload에서 추출 (payload 값 참고)
    
    db.query('SELECT * FROM InterTourTable WHERE user_id = ?;',[userId], (err, results) => {
            if (err) {
                console.log('관심관광지 조회 오류',err);
                return res.status(500).json({message : '관심관광지 조회 오류',error: err});
            }
            const inter_tours = results.map(item => (
                item.tour_id
            ))
            return res.status(200).json({
                message: '관심 관광지',
                user_id: userId,
                total_count: results.length,
                tours: inter_tours
            });
        });
};

exports.setInterTour = async (req, res) => {
    const user = req.user; // JWT payload ({ user_id, user_name ... })
    const userId = user.user_id; // JWT payload에서 추출 (payload 값 참고)
    const body = req.body; //body 저장
    const attribute = body.attribute;
    const contendidList = body.contendidList; //contentidList 저장

    if (!Array.isArray(contendidList) || contendidList.length === 0) {
        return res.status(400).json({message: "관심 관광지를 하나 이상 넣어 주세요"});
    }

    if (attribute === 'ADD') {
        try {
            const insertPromise = contendidList.map(contentid => {
                return new Promise((resolve, reject) => {
                    db.query('INSERT INTO InterTourTable (user_id, tour_id) VALUES (?, ?);', [userId, contentid], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                    });
                });
            });

            await Promise.all(insertPromise); //insertPromises 배열 전부 될 때까지 기다림. 동기로 한다는 말인가?
            return res.status(200).json({message: '추가 정상 처리 완료'});
        } catch(err) {
            console.log('setInterTour 데이터 삽입 불가',err );
            return res.status(500).json({message: 'setInterTour 데이터 삽입 불가',error: err});
        }
    }
    else if (attribute === 'DELETE') {
        try {
            const insertPromise = contendidList.map(contentid => {
                return new Promise((resolve, reject) => {
                    db.query('DELETE FROM InterTourTable WHERE user_id = ? AND tour_id = ?', [userId, contentid], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                    });
                });
            });

            await Promise.all(insertPromise); //insertPromises 배열 전부 될 때까지 기다림. 동기로 한다는 말인가?
            return res.status(200).json({message: '삭제 정상 처리 완료'});
        } catch(err) {
            console.log('setInterTour 데이터 삭제 불가',err);
            return res.status(500).json({message: 'setInterTour 데이터 삭제 불가',error: err});
        }
    }
    else {
        return res.status(400).json({message: 'attribute가 ADD, DELETE가 아님.'});
    }

};

