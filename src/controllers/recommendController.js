const db = require('../config/db.js');
const recommend = require('../services/recommend.js');
const dbAccess = require('../services/dbAccess.js');

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
    let userInfo;
    let interTourIDList;
    let visitedTourIDList;
    let interTourList = [];
    let visitedTourList = [];

    try {
        userInfo = await dbAccess.getUserInfo(userID)
    } catch (err) {
        return res.status(500).json({ message: "추천 시 userInfo 접근 오류", error: err });
    }

    try {
        interTourIDList = await dbAccess.getVisitedTour(userID);
    } catch (err) {
        return res.status(500).json({ message: "추천 시 interTour 접근 오류", error: err });
    }

    try {
        visitedTourIDList = await dbAccess.getVisitedTour(userID);
    } catch (err) {
        return res.status(500).json({ message: "추천 시 visitedTable 접근 오류", error: err });
    }

    if (interTourIDList.length !== 0) {
        try {
            interTourList = await dbAccess.getTourInfo(interTourIDList);
        } catch (err) {
            console.log("추천 시 TourTable 접근 오류")
            return res.status(500).json({ message: "추천 시 TourTable 접근 오류", error: err });
        }
    }

    if (visitedTourIDList.length !== 0) {
        try {
            visitedTourList = await dbAccess.getTourInfo(visitedTourIDList);
        } catch (err) {
            console.log("추천 시 TourTable 접근 오류")
            return res.status(500).json({ message: "추천 시 TourTable 접근 오류", error: err });
        }
    }

    try {
        const response = await recommend.RecommendTourAPI(userInfo, interTourList, visitedTourList, etcData);
        return res.status(200).json({
            message: "추천결과",
            result: response.data
        });
    } catch (err) {
        return res.status(500).json({
            message: "관광지 추천API 에러",
            error: err
        });
    }
}

exports.tourRandom = async (req, res) => {
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

exports.planRecommend = async (req, res) => {
    //사용자한테 받은 파라미터 저장
    const user = req.user;
    const userID = user.user_id;
    const body = req.body;
    const location = body.location;
    const numofPeople = body.numofPeople;
    const selectedTourIDList = body.selectedTourID;
    const query = req.query;
    console.log(query);
    const etcData = {
        location: location,
        numofPeople: numofPeople
    };

    //필요한 데이터 db에서 꺼내기
    let userInfo;
    let interTourIDList;
    let visitedTourIDList;
    let interTourList = [];
    let visitedTourList = [];

    try {
        userInfo = await dbAccess.getUserInfo(userID)
    } catch (err) {
        return res.status(500).json({ message: "추천 시 userInfo 접근 오류", error: err });
    }

    try {
        interTourIDList = await dbAccess.getVisitedTour(userID);
    } catch (err) {
        return res.status(500).json({ message: "추천 시 interTour 접근 오류", error: err });
    }

    try {
        visitedTourIDList = await dbAccess.getVisitedTour(userID);
    } catch (err) {
        return res.status(500).json({ message: "추천 시 visitedTable 접근 오류", error: err });
    }

    if (interTourIDList.length !== 0) {
        try {
            interTourList = await dbAccess.getTourInfo(interTourIDList);
        } catch (err) {
            console.log("추천 시 TourTable 접근 오류")
            return res.status(500).json({ message: "추천 시 TourTable 접근 오류", error: err });
        }
    }

    if (visitedTourIDList.length !== 0) {
        try {
            visitedTourList = await dbAccess.getTourInfo(visitedTourIDList);
        } catch (err) {
            console.log("추천 시 TourTable 접근 오류")
            return res.status(500).json({ message: "추천 시 TourTable 접근 오류", error: err });
        }
    }

    if (selectedTourIDList !== undefined && selectedTourIDList.length !== 0) {
        try {
            selectedTourList = await dbAccess.getTourInfo(selectedTourIDList);
        } catch (err) {
            console.log("추천 시 TourTable 접근 오류", err);
            return res.status(500).json({ message: "추천 시 TourTable 접근 오류", error: err });
        }
    }
    else {
        return res.status(400).json({
            message: "selectedTourID 값 잘못 넣으신듯"
        })
    }

    try {
        const response = await recommend.RecommendPlanAPI(userInfo, interTourList, visitedTourList, selectedTourList, etcData, query);
        return res.status(200).json({
            message: "여행 일정 추천 결과",
            result: response.data
        });
    } catch (err) {
        return res.status(500).json({
            message: "일정 API 오류",
            error: err
        });
    }
}