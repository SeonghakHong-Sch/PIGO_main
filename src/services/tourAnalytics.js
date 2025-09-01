const db = require('../config/db.js');

exports.tourAnalytic = async (params) => {
    const order_byList = ["month_visited_count", "total_visited_count"]

    if (!order_byList.includes(params)) {
        params = "month_visited_count";
    }

    const SQL = `
    SELECT 
	vt.tour_id, 
	tt.title,
	tt.lDongRegnCd AS region1,
	tt.lDongSignguCd AS region2,
	tt.lclsSystm1 AS tourtype,
    tt.firstimage AS tourimage,
	COUNT(*) AS total_visited_count,
	SUM(
		CASE
			WHEN vt.visited_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1
			ELSE 0
		END
	) AS month_visited_count
    FROM VisitedTourTable vt
    INNER JOIN TourTable tt 
	    ON tt.contentid = vt.tour_id
    INNER JOIN UserTable ut 
	    ON ut.user_id = vt.user_id
    GROUP BY vt.tour_id, tt.title, tt.lDongRegnCd, tt.lDongSignguCd, tt.lclsSystm1, tt.firstimage
    ORDER BY ${params} DESC
    LIMIT 30;
    `; //이거 백틱으로 이렇게 넣어도 order_byList라는 허용된 값만 들어가서 인젝션 위험 없음
    //아 그리고 ? 이건 value값 넣을때만 되더라 컬럼 선택할땐 저거 안됨 ;
    
    try {
        const [result] = await db.promise().query(SQL, [params]);
        return result;
    } catch (err) {
        return err;
    }
}
