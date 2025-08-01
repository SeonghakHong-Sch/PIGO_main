const db = require('../config/db.js');

exports.getVisitedTour = (req, res) => {
    const user = req.user; // JWT payload ({ user_id, user_name ... })
    const userId = user.user_id; // JWT payload에서 추출 (payload 값 참고)
    
    db.query('SELECT * FROM VisitedTourTable WHERE user_id = ?;',[userId], (err, results) => {
            if (err) {
                return res.status(500).json({error: err});
            }
            console.log(results);
            const visited_tours = results.map(item => ({ //tours 배열 새로 저장
                tour_id: item.tour_id,
                visited_at: item.visited_at
            }))
            return res.status(200).json({
                message: '방문지',
                user_id: userId,
                total_count: results.length,
                tours: visited_tours
            });
        });
};

exports.setVisitedTour = (req, res) => {
    const user = req.user; // JWT payload ({ user_id, user_name ... })
    const userId = user.user_id; // JWT payload에서 추출 (payload 값 참고)
    const body = req.body; //body 저장
    const attribute = body.attribute;
    const contentid = body.contentid; //contentidList 저장
    const visited_at = body.visited_at; //방문시각

    if (contentid === undefined) {
        return res.status(400).json({message: "관심 관광지 값 넣어주세요"});
    }

    if (attribute === 'ADD') {
        let sql, params;

        if (visited_at) {
            sql = 'INSERT INTO VisitedTourTable (user_id, tour_id, visited_at) VALUES (?, ?, ?);';
            params = [userId, contentid, visited_at];
        } else {
            sql = 'INSERT INTO VisitedTourTable (user_id, tour_id) VALUES (?, ?);';
            params = [userId, contentid];
        }

        db.query(sql, params, (err, results) => {
            if (err) {
                return res.status(500).json({
                        message: '방문지 추가 오류 발생',
                        error: err 
                    })
            }
            return res.status(200).json({
                message: '방문지 추가 성공',
                user_id: userId,
                contentid: contentid,
                visited_at: visited_at || new Date() //visited_at 없으면 추가(방문)한 시점
            })
        })

    } else if (attribute === 'DELETE') {
        let sql, params;

        if (visited_at) {
            sql = 'DELETE FROM VisitedTourTable WHERE user_id = ? AND tour_id = ? AND visited_at = ?';
            params = [userId, contentid, visited_at];
        } else {
            sql = 'DELETE FROM VisitedTourTable WHERE user_id = ? AND tour_id = ?';
            params = [userId, contentid];
        }

        db.query(sql, params, (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: '방문지 삭제 오류 발생',
                    error: err
                })
            }
            return res.status(200).json({
                message: '방문제 삭제 성공',
                user_id: userId,
                contentid: contentid,
                deletedCount: results.affectedRows //삭제된 행 갯수 ㅇㅇ;
            })
        })
    } else {
        return res.status(400).json({message: 'attribute가 ADD, DELETE가 아님.'});
    }
};
