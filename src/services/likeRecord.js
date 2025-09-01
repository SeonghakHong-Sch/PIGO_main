const db = require('../config/db.js');

exports.isLiked=async (user_id,review_id,type)=>{
    const querySelect ='SELECT EXISTS(SELECT 1 FROM LikeTable WHERE user_id = ? AND review_id = ? AND type = ?) AS exist';
    
    try{
        const [have] = await db.promise().query(querySelect,[user_id,review_id,type]);
        return Boolean(have[0].exist);
    }catch(err){
        console.log('isliked 조회 오류');
    }
}