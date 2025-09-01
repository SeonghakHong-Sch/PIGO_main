const db = require('../config/db.js');

async function haveTour(contentid) {
    const [isHave] = await db.promise().query('SELECT EXISTS(SELECT 1 FROM TourTable WHERE contentid = ?) AS exist', [contentid]);
    return Boolean(isHave[0].exist);
}

exports.inputTour = async (req, res) => {
    const tourData = req.body.data; //body 저장

    if (!Array.isArray(tourData) || tourData.length === 0) {
        return res.status(400).json({
            message: "Bad Request / 관광지 추가 값이 없음",
        })
    }

    let rightResults = [];
    let errorResults = [];
    let alreadyExists = [];
    for (let i = 0; i < tourData.length; i++) {
        const item = tourData[i];
        if (!(await haveTour(item.contentid))) {
            const parameters = [
                item.contentid,
                item.contenttypeid,
                item.addr1,
                item.title,
                item.mapx,
                item.mapy,
                item.firstimage,
                item.firstimage2,
                item.lDongRegnCd,
                item.lDongSignguCd,
                item.lclsSystm1,
                item.lclsSystm2,
                item.lclsSystm3
            ];

            try {
                const [result] = await db.promise().query('INSERT INTO TourTable VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', parameters);
                rightResults.push(item.contentid);
            } catch (err) {
                console.log('투어테이블 추가 오류', item.contentid, err);
                errorResults.push({ message: "투어테이블 추가 오류", contentid: item.contentid, error: err });
            }
        } else {
            alreadyExists.push(item.contentid);
        }

    }

    res.status(200).json({
        success: {
            count: rightResults.length,
            inputTourcontentid: rightResults
        },
        alreadyExists: {
            count: alreadyExists.length,
            alreadyExistscontentid: alreadyExists
        },
        fail: {
            count: errorResults.length,
            error: errorResults
        }
    });
};

exports.getTour = async (req, res) => {
    console.log(req.body);
    const contentidList = req.body.contentidList;

    if (!contentidList || !Array.isArray(contentidList)) {
        console.log("관광지 정보 요청 오류")
        return res.status(400).json({ message: "contentidList 요청 잘못됨, 값 없거나 배열이 아님" })
    }

    if (contentidList.length === 0) {
        return res.status(200).json({
            count: 0,
            data: []
        });
    }

    let resultList = [];
    const sql = "SELECT * FROM TourTable WHERE contentid IN (?) ORDER BY FIELD(contentid, ?)";

    try {
        const [result] = await db.promise().query(sql, [contentidList, contentidList]);
        
        return res.status(200).json({
            count: result.length,
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            message: "관광지 조회 오류",
            error: err
        });
    }

}