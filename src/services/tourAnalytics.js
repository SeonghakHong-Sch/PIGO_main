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

exports.tourStatistics = async (contentid) => {
    const visitedSQL = `
    SELECT
    DATE_FORMAT(visited_at, '%Y-%m') AS period,
    COUNT(*) AS visit_count
    FROM
    VisitedTourTable
    WHERE
    tour_id = ?
    GROUP BY
    period

    UNION ALL

    SELECT
    'total' AS period,
    COUNT(*) AS visit_count
    FROM
    VisitedTourTable
    WHERE
    tour_id = ?;
    `
    const interSQL = `
    SELECT 
    COUNT(*) AS inter_count 
    FROM TourTable 
    WHERE contentid = ?;
    `

    const userSQL = `
    SELECT
    CASE
    WHEN u.user_age BETWEEN 0 AND 9 THEN '0-9'
    WHEN u.user_age BETWEEN 10 AND 19 THEN '10-19'
    WHEN u.user_age BETWEEN 20 AND 29 THEN '20-29'
    WHEN u.user_age BETWEEN 30 AND 39 THEN '30-39'
    WHEN u.user_age BETWEEN 40 AND 49 THEN '40-49'
    WHEN u.user_age >= 50 THEN '50+'
    ELSE 'unknown'
    END AS age_group,
    u.user_sex,
    COUNT(*) AS visit_count
    FROM
    VisitedTourTable v
    JOIN
    UserTable u ON v.user_id = u.user_id
    WHERE
    v.tour_id = ?
    GROUP BY
    age_group, u.user_sex
    ORDER BY
    age_group, u.user_sex;
    `

    try {
        const [visitedResult] = await db.promise().query(visitedSQL, [contentid, contentid]);
        const [interResult] = await db.promise().query(interSQL, [contentid]);
        const [userStatisticResult] = await db.promise().query(userSQL, [contentid]);
        console.log(visitedResult, interResult, userStatisticResult);
        const result = {
            visitedResult : visitedResult,
            interResult : interResult,
            userStatisticResult : userStatisticResult
        };
        return result;

    } catch (err) {
        return err;
    }

}
