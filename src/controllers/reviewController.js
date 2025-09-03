const db = require('../config/db.js');
const reviewAver = require('../services/reviewAver.js');

exports.writeReview = async (req, res) => {
    const user = req.user;
    const userID = user.user_id;

    const body = req.body;
    const tour_id = body.tour_id;
    const content = body.content;
    const rating = body.rating;

    const insertQuery = 'INSERT INTO ReviewTable (user_id, tour_id, content, rating) VALUES (?, ?, ?, ?)';
    try {
        const [results] = await db.promise().query(insertQuery, [userID, tour_id, content, rating]);
        await reviewAver.updateAverage(tour_id);
        return res.status(200).json({ message: '리뷰 작성 성공', changedRows: results.changedRows });
    } catch (err) {
        console.log('리뷰 작성 오류');
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

    const [reviewData] = await db.promise().query('SELECT user_id, tour_id FROM ReviewTable WHERE review_id = ?', [review_id]);
    const review = reviewData[0];

    if (!review) {
        return res.status(400).json({ message: "리뷰 미존재" });
    }
    else if (userID != review.user_id || review_id != review.review_id) {
        console.log("리뷰 수정 정보 불일치, JWT 유저id : ", userID, " 리뷰 유저id : ", review.user_id);
        return res.status(400).json({ message: "리뷰 수정 정보 불일치" })
    }

    if (new_content == null) {
        new_content = review.content;
    }
    if (new_rating == null) {
        new_rating = review.rating;
    }

    const updateQuery = 'UPDATE ReviewTable SET content = ? , rating = ?  WHERE id = ?';

    try {
        const [result] = await db.promise().query(updateQuery, [new_content, new_rating, review_id]);
        if (new_rating != review.rating) {
            await reviewAver.updateAverage(tour_id);
        }
        return res.status(200).json({ message: '리뷰 수정 성공', changedRows: result.changedRows });
    } catch (err) {
        console.log('리뷰 수정 오류')
        return res.status(500).json({ message: '리뷰 수정 오류', error: err });
    }
}


exports.deleteReview = async (req, res) => {
    const user = req.user;
    const userID = user.user_id

    const body = req.body;
    const review_id = body.review_id;


    const [reviewData] = await db.promise().query('SELECT user_id, tour_id FROM ReviewTable WHERE review_id = ?', [review_id]);
    const review = reviewData[0];

    if (!review) {
        return res.status(400).json({ message: "리뷰 미존재" });
    }
    else if (userID != review.user_id || review_id != review.review_id) {
        console.log("리뷰 삭제 정보 불일치, JWT 유저id : ", userID, " 리뷰 유저id : ", review.user_id);
        return res.status(400).json({ message: "리뷰 삭제 정보 불일치" })
    }

    const updateQuery = 'UPDATE ReviewTable SET is_deleted = 1 WHERE id = ?';

    try {
        const [result] = await db.promise().query(updateQuery, [review_id]);
        await reviewAver.updateAverage(tour_id);
        return res.status(200).json({ message: '리뷰 삭제 성공' });
    } catch (err) {
        console.log('리뷰 삭제 오류');
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
                SELECT r.*, u.user_name
                FROM ReviewTable r
                JOIN UserTable u ON r.user_id = u.user_id
                WHERE r.is_deleted = 0
                ORDER BY RAND() LIMIT 30
            `;
        }
        else if (requestType == 'tour') {
            const tour_id = query.tour_id;
            querySelect = `
                SELECT r.*, u.user_name
                FROM ReviewTable r
                JOIN UserTable u ON r.user_id = u.user_id
                WHERE r.tour_id = ? AND r.is_deleted = 0
                ORDER BY r.created DESC
            `;
            params = [tour_id];
        }
        else if (requestType == 'user') {
            const user_id = query.user_id;
            querySelect = `
                SELECT r.*, u.user_name
                FROM ReviewTable r
                JOIN UserTable u ON r.user_id = u.user_id
                WHERE r.user_id = ? AND r.is_deleted = 0
                ORDER BY r.created DESC
            `;
            params = [user_id];
        }
        else {
            return res.status(400).json({ message: "잘못된 리뷰 정보 요청" });
        }

        const [rows] = await db.promise().query(querySelect, params);
        return res.json(rows);

    } catch (err) {
        console.log('리뷰 정보 요청 오류');
        return res.status(500).json({ message: '리뷰 요청 오류', error: err });
    }
}