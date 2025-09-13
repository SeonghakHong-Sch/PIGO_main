const db = require('../config/db.js')

exports.haveUser = async (connection, userID) => {
    //예외처리???
    const [have] = await connection.promise().query(
        'SELECT EXISTS(SELECT 1 FROM UserTable WHERE user_id = ?) AS exist',
        [userID]
    );
    return Boolean(have[0].exist);
}


exports.register = async (connection, user) => {
    const id = user.id;
    const name = user.properties.nickname;
    const email = user.kakao_account.email;
    const insertQuery = 'INSERT INTO UserTable (user_id, user_name, user_email) VALUES (?, ?, ?)';
    const [rows, fields] = await connection.promise().query(
        insertQuery, [id, name, email]
    );
    console.log(rows);
}

exports.deleteIntertourByUserId = async (user_id) => {
    const queryDelete = 'DELETE FROM InterTourTable WHERE user_id = ?';
    try {
        const [result] = await db.promise().query(queryDelete, [user_id]);
        console.log('유저 관심관광지 전체삭제 성공 changedRows : ', result.changedRows);
        return true;
    } catch (err) {
        console.log('유저 관심관광지 전체삭제 오류', err);
        return false;
    }
}

exports.deleteInterLocationByUserId = async (user_id) => {
    const queryDelete = 'DELETE FROM InterLocationTable WHERE user_id = ?';
    try {
        const [result] = await db.promise().query(queryDelete, [user_id]);
        console.log('유저 관심지역 전체삭제 성공 changedRows : ', result.changedRows);
        return true;
    } catch (err) {
        console.log('유저 관심지역 전체삭제 오류', err);
        return false;
    }
}

exports.deleteVisitedTourByUserId = async (user_id) => {
    const queryDelete = 'DELETE FROM VisitedTourTable WHERE user_id = ?';
    try {
        const [result] = await db.promise().query(queryDelete, [user_id]);
        console.log('유저 방문지역 전체삭제 성공 changedRows : ', result.changedRows);
        return true;
    } catch (err) {
        console.log('유저 방문지역 전체삭제 오류', err);
        return false;
    }
}

exports.deleteReviewByUserId = async (user_id) => {
    const queryUpdate = 'Update ReviewTable SET user_id = -1 WHERE user_id = ?';
    try {
        const [result] = await db.promise().query(queryUpdate, [user_id]);
        console.log('유저 리뷰 전체삭제 성공 changedRows : ', result.changedRows);
        return true;
    } catch (err) {
        console.log('유저 리뷰 전체삭제 오류', err);
        return false;
    }
}

exports.deleteLikesByUserId = async (user_id) => {
    const queryUpdate = 'Update LikeTable SET user_id = -1 WHERE user_id = ?';
    try {
        const [result] = await db.promise().query(queryUpdate, [user_id]);
        console.log('유저 좋아요 전체삭제 성공 changedRows : ', result.changedRows);
        return true;
    } catch (err) {
        console.log('유저 좋아요 전체삭제 오류', err);
        return false;
    }
}

exports.deleteUser = async (user_id) => {
    const queryDelete = 'DELETE FROM UserTable WHERE user_id = ?';
    const [result] = await db.promise().query(queryDelete, [user_id]);
    return result;
}

exports.getUserInfo = async (userID) => {
    const userInfoSql = "SELECT * FROM UserTable WHERE user_id = ?";
    let userInfo;

    try {
        const [userInfoRow] = await db.promise().query(userInfoSql, [userID]);
        userInfo = userInfoRow[0];
        userInfo.user_sex = userInfo.user_sex === 'male' ? 1 : userInfo.user_sex === 'female' ? 0 : null;
        return userInfo;
    } catch (err) {
        console.log("유저정보 접근 오류, dbAccess.js/getUserInfo")
        throw err;
    }
}

exports.getInterTour = async (userID) => {
    const interTourSql = "SELECT tour_id FROM InterTourTable WHERE user_id = ?";
    let interTourIDList;

    try {
        [interTourIDList] = await db.promise().query(interTourSql, [userID]);
        interTourIDList = interTourIDList.map(item => item.tour_id) || [];
        return interTourIDList;
    } catch (err) {
        console.log("interTour 접근 오류, dbAccess.js/getInterTour");
        throw err;
    }
}

exports.getVisitedTour = async (userID) => {
    const visitedTourSql = "SELECT tour_id FROM VisitedTourTable WHERE user_id = ?"
    let visitedTourIDList;

    try {
        [visitedTourIDList] = await db.promise().query(visitedTourSql, [userID]);
        visitedTourIDList = visitedTourIDList.map(item => item.tour_id) || [];
        return visitedTourIDList;
    } catch (err) {
        console.log("visitedTable 접근 오류, dbAccess.js/getVisitedTour");
        throw err;
    }
}

exports.getTourInfo = async (TourIDList) => {
    const TourTBSql = "SELECT * FROM TourTable WHERE contentid IN (?)"
    let TourList;

    try {
        [TourList] = await db.promise().query(TourTBSql, [TourIDList]);
        return TourList;
    } catch (err) {
        console.log("TourTable 접근 오류, dbAccess.js/getTourInfo");
        throw err;
    }
}