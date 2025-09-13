const axios = require('axios');

exports.RecommendTourAPI = async (user_info, interTourList, visitedTourList, etcData) => {
    try {
        const data = {
            user_info: {
                user_id: user_info.user_id,
                user_name: user_info.user_name,
                user_sex: user_info.user_sex,
                user_age: user_info.user_age
            },
            interTour: {
                count: interTourList.length,
                items: interTourList
            },
            visitedTour: {
                count: visitedTourList.length,
                items: visitedTourList
            },
            etcData: etcData
        };
        //console.log(JSON.stringify(data, null, 2)); // 보기 좋게 들여쓰기 포함
        console.log(process.env.RECOMMEND_SERVER_URL + '/get_tour_list');
        const response = await axios.post(process.env.RECOMMEND_SERVER_URL + '/get_tour_list', data);
        return response;
    } catch (err) {
        throw err;
        //console.error(err);
    }
}

exports.RandomTourAPI = async () => {
    try {
        console.log(process.env.RECOMMEND_SERVER_URL + '/random/get_tourlist');
        const response = await axios.get(process.env.RECOMMEND_SERVER_URL + '/random/get_tourlist');
        return response;
    } catch (err) {
        throw err
    }
}

exports.RecommendPlanAPI = async (user_info, interTourList, visitedTourList, selectedTourList, etcData, query) => {
    try {
        const data = {
            user_info: {
                user_id: user_info.user_id,
                user_name: user_info.user_name,
                user_sex: user_info.user_sex,
                user_age: user_info.user_age
            },
            interTour: {
                count: interTourList.length,
                items: interTourList
            },
            visitedTour: {
                count: visitedTourList.length,
                items: visitedTourList
            },
            selectedTour: {
                count: selectedTourList.length,
                items: selectedTourList
            },
            etcData: etcData
        };
        //console.log(JSON.stringify(data, null, 2)); // 보기 좋게 들여쓰기 포함
        console.log(process.env.RECOMMEND_SERVER_URL + '/calendar');
        const response = await axios.post(process.env.RECOMMEND_SERVER_URL + '/calendar', data, {
            params: {date: query.date, food_day: query.food_day, tour_day: (query.tour_day)}
        });
        return response;
    } catch (err) {
        throw err;
        //console.error(err);
    }
}