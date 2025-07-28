exports.haveUser=async (connection,userID)=>{
    //예외처리???
    userID=Number(userID);
    const [have]=await connection.promise().query(
        'SELECT EXISTS(SELECT 1 FROM UserTable WHERE user_id = ?) AS exist',
        [userID]
    );
    return Boolean(have[0].exist);
}