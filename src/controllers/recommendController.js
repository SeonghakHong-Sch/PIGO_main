const db = require('../config/db.js');
const recommend = require('../services/recommend.js');

exports.tourRecommend = async (req, res) => {
    //사용자한테 받은 파라미터 저장
    const user = req.user;
    const userID = user.user_id;
    const body = req.body;
    const location = body.location;
    const numofPeople = body.numofPeople;

    const etcData = {
        location: location,
        numofPeople: numofPeople
    };
    //예외처리하기

    //필요한 데이터 db에서 꺼내기
    const userInfoSql = "SELECT * FROM UserTable WHERE user_id = ?";
    const interTourSql = "SELECT tour_id FROM InterTourTable WHERE user_id = ?";
    const visitedTourSql = "SELECT tour_id FROM VisitedTourTable WHERE user_id = ?"
    const TourTBSql = "SELECT * FROM TourTable WHERE contentid IN (?)"
    let userInfo;
    let interTourIDList;
    let visitedTourIDList;
    let interTourList = [];
    let visitedTourList = [];

    try {
        const [userInfoRow] = await db.promise().query(userInfoSql, [userID]);
        userInfo = userInfoRow[0];
        userInfo.user_sex = userInfo.user_sex === 'male' ? 1 : userInfo.user_sex === 'female' ? 0 : null;
    } catch (err) {
        console.log("추천 시 유저정보 접근 오류")
        return res.status(500).json({ message: "추천 시 유저정보 접근 오류", error: err });
    }

    try {
        [interTourIDList] = await db.promise().query(interTourSql, [userID]);
        interTourIDList = interTourIDList.map(item => item.tour_id) || [];
    } catch (err) {
        console.log("추천 시 interTour 접근 오류")
        return res.status(500).json({ message: "추천 시 interTour 접근 오류", error: err });
    }

    try {
        [visitedTourIDList] = await db.promise().query(visitedTourSql, [userID]);
        visitedTourIDList = visitedTourIDList.map(item => item.tour_id) || [];
    } catch (err) {
        console.log("추천 시 visitedTable 접근 오류")
        return res.status(500).json({ message: "추천 시 visitedTable 접근 오류", error: err });
    }

    if (interTourIDList.length !== 0) {
        try {
            [interTourList] = await db.promise().query(TourTBSql, [interTourIDList]);
        } catch (err) {
            console.log("추천 시 TourTable 접근 오류")
            return res.status(500).json({ message: "추천 시 TourTable 접근 오류", error: err });
        }
    }

    if (visitedTourIDList.length !== 0) {
        try {
            [visitedTourList] = await db.promise().query(TourTBSql, [visitedTourIDList]);
        } catch (err) {
            console.log("추천 시 TourTable 접근 오류")
            return res.status(500).json({ message: "추천 시 TourTable 접근 오류", error: err });
        }
    }

    
    try{
        const response = await recommend.RecommendTourAPI(userInfo, interTourList, visitedTourList, etcData);
        return res.status(200).json({
            message: "추천결과",
            result: response.data
        });
    }catch(err){
        return res.status(500).json({
            message: "관광지 추천API 에러",
            error: err
        });
    }
}

exports.tourRandom = async (req, res) => {
    console.log(1);
    try {
        const response = await recommend.RandomTourAPI();
        return res.status(200).json({
            message: "랜덤관광지 결과",
            result: response.data.data
        });
    } catch (err) {
        return res.status(500).json({
            message: "랜덤API 에러",
            error: err
        });
    }
}
