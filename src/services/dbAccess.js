const db = require('../config/db.js')

exports.haveUser=async (connection,userID)=>{
    //예외처리???
    const [have]=await connection.promise().query(
        'SELECT EXISTS(SELECT 1 FROM UserTable WHERE user_id = ?) AS exist',
        [userID]
    );
    return Boolean(have[0].exist);
}


exports.register=async (connection,user)=>{
    const id=user.id;
    const name=user.properties.nickname;
    const email=user.kakao_account.email;
    const insertQuery='INSERT INTO UserTable (user_id, user_name, user_email) VALUES (?, ?, ?)';
    const [rows,fields] = await connection.promise().query(
        insertQuery,[id,name,email]
    );
    console.log(rows);
}

exports.deleteIntertourByUserId = async (user_id)=>{
    const queryDelete = 'DELETE FROM InterTourTable WHERE user_id = ?';
    try{
        const [result] = await db.promise().query(queryDelete,[user_id]);
        console.log('유저 관심관광지 전체삭제 성공 changedRows : ',result.changedRows);
        return true;
    }catch(err){
        console.log('유저 관심관광지 전체삭제 오류',err);
        return false;
    }
}

exports.deleteInterLocationByUserId = async (user_id)=>{
    const queryDelete = 'DELETE FROM InterLocationTable WHERE user_id = ?';
    try{
        const [result] = await db.promise().query(queryDelete,[user_id]);
        console.log('유저 관심지역 전체삭제 성공 changedRows : ',result.changedRows);
        return true;
    }catch(err){
        console.log('유저 관심지역 전체삭제 오류',err);
        return false;
    }
}

exports.deleteVisitedTourByUserId = async (user_id)=>{
    const queryDelete = 'DELETE FROM VisitedTourTable WHERE user_id = ?';
    try{
        const [result] = await db.promise().query(queryDelete,[user_id]);
        console.log('유저 방문지역 전체삭제 성공 changedRows : ',result.changedRows);
        return true;
    }catch(err){
        console.log('유저 방문지역 전체삭제 오류',err);
        return false;
    }
}

exports.deleteReviewByUserId = async (user_id)=>{
    const queryDelete = 'DELETE FROM ReviewTable WHERE user_id = ?';
    // 삭제된 리뷰들 평점 갱신하기
    // user - review n개 - n개 tour 각각 review 평균 조회 + tour에 반영 sql문 2n개????
    // or 그냥 냅두기 (리뷰 갱신 자주 되거나 리뷰가 많아서 평균에 영향 적으면 ㄱㅊ)
    // or 일정시간마다 리뷰 갱신해주기 (굳이?) 
    try{
        const [result] = await db.promise().query(queryDelete,[user_id]);
        console.log('유저 리뷰 전체삭제 성공 changedRows : ',result.changedRows);
        return true;
    }catch(err){
        console.log('유저 리뷰 전체삭제 오류',err);
        return false;
    }
}

exports.deleteLikesByUserId = async (user_id)=>{
    const queryDelete = 'DELETE FROM LikeTable WHERE user_id = ?';
    try{
        const [result] = await db.promise().query(queryDelete,[user_id]);
        console.log('유저 좋아요 전체삭제 성공 changedRows : ',result.changedRows);
        return true;
    }catch(err){
        console.log('유저 좋아요 전체삭제 오류',err);
        return false;
    }
}