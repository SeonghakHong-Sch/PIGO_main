const db = require('../config/db.js');

exports.simpleTourInfo = async (contentidList) => {
    if (!contentidList || contentidList.length === 0) {
        return []
    };

    const placeholders = contentidList.map(()=>'?').join(', ');
    const sql = `
    SELECT 
        tt.contentid AS tour_id,
        tt.title AS title,
        tt.addr1 AS address,
        tt.lclsSystm1 AS tourtype,
        tt.firstimage AS tourimage
    FROM TourTable tt
    WHERE
	    tt.contentid IN (${placeholders});
    `;

    try {
        const [result] = await db.promise().query(sql, contentidList);
        return result;
    } catch (err) {
        console.log('관심 관광지 tourtable 조회 오류', err);
        throw err;
    }
}