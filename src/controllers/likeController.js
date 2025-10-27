const db = require('../config/db.js');
const likeRecord = require('../services/likeRecord.js');


exports.like = async (req, res) => {
    const user = req.user;
    const userID = user.user_id;

    const body = req.body;
    const review_id = body.review_id;
    console.log(review_id);
    const liked = await likeRecord.isLiked(userID, review_id, 1);

    if (liked) {
        const queryDelete = 'DELETE FROM LikeTable WHERE user_id = ? AND review_id = ? AND is_like = ?';
        try {
            const [results] = await db.promise().query(queryDelete, [userID, review_id, 1]);
            return res.status(200).json({ message: '좋아요 삭제 성공' });
        } catch (err) {
            console.log('좋아요 삭제 오류', err);
            return res.status(500).json({ message: '좋아요 삭제 오류', error: err });
        }
    }
    else {
        const queryInsert = 'INSERT INTO LikeTable (user_id, review_id) VALUES (?, ?)';
        try {
            const [results] = await db.promise().query(queryInsert, [userID, review_id]);
            return res.status(200).json({ message: '좋아요 성공', detail: results });
        } catch (err) {
            console.log('좋아요 오류', err);
            return res.status(500).json({ message: '좋아요 오류', error: err });
        }
    }
}

exports.dislike = async (req, res) => {
    const user = req.user;
    const userID = user.user_id;

    const body = req.body;
    const review_id = body.review_id;

    const disliked = await likeRecord.isLiked(userID, review_id, 0);

    if (disliked) {
        const queryDelete = 'DELETE FROM LikeTable WHERE user_id = ? AND review_id = ? AND is_like = ?';
        try {
            const [results] = await db.promise().query(queryDelete, [userID, review_id, 0]);
            return res.status(200).json({ message: '싫어요 삭제 성공' });
        } catch (err) {
            console.log('싫어요 삭제 오류', err);
            return res.status(500).json({ message: '싫어요 삭제 오류', error: err });
        }
    }
    else {
        const queryInsert = 'INSERT INTO LikeTable (user_id, review_id, is_like) VALUES (?, ?, ?)';
        try {
            const [results] = await db.promise().query(queryInsert, [userID, review_id, 0]);
            return res.status(200).json({ message: '싫어요 성공' });
        } catch (err) {
            console.log('싫어요 오류', err);
            return res.status(500).json({ message: '싫어요 오류', error: err });
        }
    }
}

exports.getlikes = async (req, res) => {
    const query = req.query;
    const review_id = query.review_id;

    const querySelect = `
    SELECT SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes, SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes 
    FROM LikeTable
    `;

    try {
        const [rows] = await db.promise().query(querySelect, [review_id, review_id]);
        return res.status(200).json(rows);
    } catch (err) {
        console.log('좋아요/싫어요 조회 오류', err);
        return res.status(500).json({ message: '좋아요/싫어요 조회 오류', error: err });
    }
}
