const db=require('../config/db.js');

updateAverage = async(tour_id)=>{
    const querySelect="SELECT ROUND(AVG(rating),2) AS avg_rating FROM ReviewTable WHERE tour_id = ?";
    try{
        const [results] = await db.promise.query(querySelect,[tour_id]);
        const avg_rating=results.avg_rating;
        const queryUpdate="UPDATE TourTable SET avg_rating = ? WHERE tour_id = ?";
        try{
            const [result] = await db.promise().query(queryUpdate,[avg_rating,tour_id]);
            console.log("관광지 리뷰 평균 갱신 성공");
        }catch(err){
            console.log('관광지 리뷰 평균 갱신 실패');
        }
    }catch(err){
        console.log('관광지 리뷰 평균 구하기 실패 : ',err);
    }
}

exports.writeReview= async (req,res)=>{
    const user=req.user;
    const userID=user.user_id;
    const body=req.body;
    const tour_id=body.tour_id;
    const content=body.content;
    const rating=body.rating;
    
    const insertQuery='INSERT INTO ReviewTable (user_id, tour_id, content, rating) VALUES (?, ?, ?, ?)';
    try{
        const [results]=await db.promise().query(insertQuery,[userID,tour_id,content,rating]);
        updateAverage(tour_id);
        return res.status(200).json({message:'리뷰 작성 성공',changedRows:results.changedRows});
    }catch(err){
        return res.status(500).json({message:'리뷰 작성 오류',error:err});
    }
}

exports.editReview= async(req,res)=>{ //이거 userid랑 tourid 확인은 프론트에서 하는게 나을듯?
    const user=req.user;
    const userID=user.user_id
    const body=req.body;
    const user_id=req.user_id;
    const new_content=body.new_content; 
    const new_rating=body.new_rating;
    const review_id=body.review_id;
    if(userID!=user_id){
        console.log("JWT 유저id : ",userID," 리뷰 수정 요청 유저id : ",user_id);
        return res.status(500).json({message:"리뷰 수정 유저 id가 일치하지 않습니다"})
    }

    const updateQuery='UPDATE ReviewTable SET content = ? , rating = ?  WHERE id = ?';

    try{
        const [result]=await db.promise().query(updateQuery,[new_content,new_rating,review_id]);
        updateAverage(tour_id);
        return res.status(200).json({message:'리뷰 수정 성공',changedRows:result.changedRows});
    }catch(err){
        return res.status(500).json({message:'리뷰 작성 오류',error:err});
    }
}


// exports.deleteReview= async(req,res)=>{ 
//     const user=req.user;
//     const userID=user.user_id
//     const body=req.body;
//     const user_id=req.user_id;
    
//     if(userID!=user_id){
//         console.log("JWT 유저id : ",userID," 리뷰 삭제 요청 유저id : ",user_id);
//         return res.status(500).json({message:"리뷰 삭제 유저 id가 일치하지 않습니다"})
//     }
// }

//이거 소프트 delete 하드 delete 고민좀