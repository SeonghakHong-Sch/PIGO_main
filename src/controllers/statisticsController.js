const analytics = require('../services/tourAnalytics.js');

exports.getHotplace = async (req, res) => {
    const params = req.params.order_by;
    console.log(params);
    if (!params) {
        return res.status(400).json({
            message: "order_by 값 필수임"
        });
    }

    // try{
    //     const result = await analytics.tourAnalytic(params);
    //     console.log(result);
    //     return res.status(200).json(result);
    // } catch (err) {

    // }

    const result = await analytics.tourAnalytic(params);
    
    
    if (result instanceof Error) {
        return res.status(500).json({
            message: "핫플 조회 오류",
            error: result
        })
    } else {
        return res.status(200).json(result);
    }
};