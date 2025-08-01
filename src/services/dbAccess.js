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