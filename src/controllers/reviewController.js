const nodemon = require('nodemon');
const db = require('../config/db.js');
const reviewAver = require('../services/reviewAver.js');

exports.writeReview = async (req, res) => {
    const user = req.user;
    const userID = user.user_id;

    const body = req.body;
    const tour_id = body.tour_id;
    const content = body.content;
    const rating = body.rating;

    if (tour_id == null || content == null || rating == null) {
        console.log('리뷰 작성 정보 부족', tour_id, content, rating);
        return res.status(400).json({ message: '리뷰 작성 정보 부족' });
    }
    else if (rating > 5 || rating < 1) {
        console.log('리뷰 점수 이상', rating);
        return res.status(400).json({ message: '리뷰 점수 이상' });
    }

    const querySelect = 'SELECT EXISTS(SELECT 1 FROM ReviewTable WHERE user_id = ? AND tour_id = ? AND is_deleted = 0 ) AS exist';
    try {
        const [have] = await db.promise().query(querySelect, [userID, tour_id]);
        console.log(have[0].exist);
        if (have[0].exist) {
            console.log(have[0].exist);
            return res.status(400).json({ message: "리뷰가 이미 존재합니다" });
        }
    } catch (err) {
        console.log('리뷰 존재여부 확인 오류', err);
    }

    const insertQuery = 'INSERT INTO ReviewTable (user_id, tour_id, content, rating) VALUES (?, ?, ?, ?)';
    try {
        const [results] = await db.promise().query(insertQuery, [userID, tour_id, content, rating]);
        await reviewAver.updateAverage(tour_id);
        return res.status(200).json({ message: '리뷰 작성 성공', changedRows: results.changedRows });
    } catch (err) {
        console.log('리뷰 작성 오류', err);
        return res.status(500).json({ message: '리뷰 작성 오류', error: err });
    }
}

exports.editReview = async (req, res) => { //필터 쿼리문써서
    const user = req.user;
    const userID = user.user_id

    const body = req.body;
    const review_id = body.review_id;
    const new_content = body.new_content;
    const new_rating = body.new_rating;

    const [reviewData] = await db.promise().query('SELECT * FROM ReviewTable WHERE review_id = ?', [review_id]);
    const review = reviewData[0];

    if (!review) {
        return res.status(400).json({ message: "리뷰 미존재" });
    }
    else if (userID != review.user_id || review_id != review.review_id) {
        console.log("리뷰 수정 정보 불일치, JWT 유저id : ", userID, " 리뷰 유저id : ", review.review_id);
        return res.status(400).json({ message: "리뷰 수정 정보 불일치" })
    }

    if (new_content == null) {
        new_content = review.content;
    }
    if (new_rating == null) {
        new_rating = review.rating;
    } else if (new_rating > 5 || newrating < 1) {
        console.log('리뷰 수정 점수 이상', new_rating);
        return res.status(400).json({ message: '리뷰 수정 점수 이상' });
    }

    const updateQuery = 'UPDATE ReviewTable SET content = ? , rating = ?  WHERE review_id = ?';

    try {
        const [result] = await db.promise().query(updateQuery, [new_content, new_rating, review_id]);
        if (new_rating != review.rating) {
            await reviewAver.updateAverage(review.tour_id);
        }
        return res.status(200).json({ message: '리뷰 수정 성공', changedRows: result.changedRows });
    } catch (err) {
        console.log('리뷰 수정 오류', err);
        return res.status(500).json({ message: '리뷰 수정 오류', error: err });
    }
}


exports.deleteReview = async (req, res) => {
    const user = req.user;
    const userID = user.user_id

    const body = req.body;
    const review_id = body.review_id;


    const [reviewData] = await db.promise().query('SELECT * FROM ReviewTable WHERE review_id = ?', [review_id]);
    const review = reviewData[0];

    if (!review) {
        return res.status(400).json({ message: "리뷰 미존재" });
    }
    else if (userID != review.user_id || review_id != review.review_id) {
        console.log("리뷰 삭제 정보 불일치, JWT 유저id : ", userID, " 리뷰 유저id : ", review.user_id);
        return res.status(400).json({ message: "리뷰 삭제 정보 불일치" })
    }

    const updateQuery = 'UPDATE ReviewTable SET is_deleted = 1 WHERE review_id = ?';

    try {
        const [result] = await db.promise().query(updateQuery, [review_id]);
        await reviewAver.updateAverage(review.tour_id);
        return res.status(200).json({ message: '리뷰 삭제 성공' });
    } catch (err) {
        console.log('리뷰 삭제 오류', err);
        return res.status(500).json({ message: '리뷰 삭제 오류', error: err });
    }
}


exports.getReview = async (req, res) => {
    const query = req.query;
    const requestType = query.requestType;


    try {
        let querySelect = '';
        let params = [];

        if (requestType == 'random') {
            querySelect = `
                SELECT r.*, u.user_name, 
                    COALESCE(likes_count.likes, 0) AS likes,
                    COALESCE(likes_count.dislikes, 0) AS dislikes
                FROM ReviewTable r
                JOIN UserTable u ON r.user_id = u.user_id
                LEFT JOIN (
                    SELECT review_id, SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes, SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
                    FROM LikeTable
                    GROUP BY review_id
                ) AS likes_count ON r.review_id = likes_count.review_id
                WHERE r.is_deleted = 0 AND r.user_id != -1
                ORDER BY RAND() LIMIT 30
            `;
        }
        else if (requestType == 'tour') {
            const tour_id = query.tour_id;
            querySelect = `
                SELECT r.*, u.user_name, 
                    COALESCE(likes_count.likes, 0) AS likes,
                    COALESCE(likes_count.dislikes, 0) AS dislikes
                FROM ReviewTable r
                JOIN UserTable u ON r.user_id = u.user_id
                LEFT JOIN (
                    SELECT review_id, SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes, SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
                    FROM LikeTable
                    GROUP BY review_id
                ) AS likes_count ON r.review_id = likes_count.review_id
                WHERE r.tour_id = ? AND r.is_deleted = 0
                ORDER BY r.created DESC
            `;
            params = [tour_id];
        }
        else if (requestType == 'user') {
            const user_id = query.user_id;
            if (user_id == -1) {
                return res.status(400).json({ message: '삭제된 유저(user_id -1)에 대한 리뷰 정보 요청' });
            }
            querySelect = `
                SELECT r.*, u.user_name, COALESCE(likes_count.likes, 0) AS likes, COALESCE(likes_count.dislikes, 0) AS dislikes
                FROM ReviewTable r
                JOIN UserTable u ON r.user_id = u.user_id
                LEFT JOIN (
                    SELECT review_id,
                        SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
                        SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
                    FROM LikeTable
                    GROUP BY review_id
                ) AS likes_count ON r.review_id = likes_count.review_id
                WHERE r.user_id = ? AND r.is_deleted = 0
                ORDER BY r.created DESC
            `;
            params = [user_id];
        }
        else if (requestType == 'review') {
            const review_id = query.review_id;
            querySelect = `
                SELECT r.*, u.user_name, COALESCE(likes_count.likes, 0) AS likes, COALESCE(likes_count.dislikes, 0) AS dislikes
                FROM ReviewTable r
                JOIN UserTable u ON r.user_id = u.user_id
                LEFT JOIN (
                    SELECT review_id,
                        SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
                        SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
                    FROM LikeTable
                    GROUP BY review_id
                ) AS likes_count ON r.review_id = likes_count.review_id
                WHERE r.review_id = ? AND r.is_deleted = 0
            `;
            params = [review_id];
        }
        else {
            return res.status(400).json({ message: "잘못된 리뷰 정보 요청" });
        }

        const [rows] = await db.promise().query(querySelect, params);
        return res.json(rows);

    } catch (err) {
        console.log('리뷰 정보 요청 오류', err);
        return res.status(500).json({ message: '리뷰 요청 오류', error: err });
    }
}