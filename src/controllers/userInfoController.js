const db=require('../config/db.js');

exports.getUserInfo=(req,res)=>{
    const userID=req.user.user_id; //payload에서 userid
    const querySelect='SELECT * FROM UserTable WHERE user_id = ?';

    db.query(querySelect,[userID],(err,results)=>{
        if(err){
            return res.status(500).json({error:err});
        }
        if(results.length==0){
            return res.status(404).json({error:'유저 없음!'});
        }
        console.log(results);//이거 ID를 알려줘야하나말아야하나

        const user=results[0];//PK니까 예외처리 안했긴했는데 해야하나
        return res.status(200).json({
            message:'유저 정보',
            ID:user.user_id,
            name:user.user_name,
            email:user.user_email,
            sex:user.user_sex,
            age:user.user_age,
        });
    });
}

exports.setUserInfo=async (req,res)=>{
    const userID=req.user.user_id;
    const body=req.body;//body에 newName newAge이런식으로 저장할예정
    const newName=body.newName ?? null;
    const newEmail=body.newEmail ?? null;
    const newSex=body.newSex ?? null;
    const newAge=body.newAge?? null;
    const queryUpdate='UPDATE UserTable SET user_name = ?, user_email = ?, user_sex = ?, user_age = ? WHERE user_id = ?';
    
    try{
        const [result]=await db.promise().query(queryUpdate,[newName,newEmail,newSex,newAge,userID]);
        return res.status(200).json({message:'success', changedRows:result.changedRows});
    }   
    catch(err){
        return res.status(500).json({error:'DB Update fail',detail:err});
    }
}