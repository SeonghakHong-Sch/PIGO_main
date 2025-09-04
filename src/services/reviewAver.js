const db = require('../config/db.js');

exports.updateAverage = async (tour_id) => {
    const querySelect = "SELECT ROUND(AVG(rating),2) AS avg_rating FROM ReviewTable WHERE tour_id = ? AND is_deleted = 0";
    try {
        const [results] = await db.promise().query(querySelect, [tour_id]);
        const avg_rating = results[0].avg_rating;
        const queryUpdate = "UPDATE TourTable SET avg_rating = ? WHERE contentid = ?";
        try {
            const [result] = await db.promise().query(queryUpdate, [avg_rating, tour_id]);
            console.log("관광지 리뷰 평균 갱신 성공",avg_rating);
        } catch (err) {
            console.log('관광지 리뷰 평균 갱신 실패',err);
        }
    } catch (err) {
        console.log('관광지 리뷰 평균 구하기 실패 : ', err);
    }
}