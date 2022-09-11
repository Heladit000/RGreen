import { getValuesRangeValuesWithTime } from "../../../database/index.js";
import response from "../../utils/response.js";

import express from "express";

const wateringTimesAPI = express.Router();

const TABLE = "watering_times"

//return history of wateringTimes data with pages
wateringTimesAPI.get("/:page", (req, res) => {
    getValuesRangeValuesWithTime(TABLE, req.params.page, req.query.limit)
        .then((data) => {
            response(res, false, data, 200);
        })
        .catch((err) => {
            response(res, err, "cant get wateringTimes", 500);
        })
})

export default wateringTimesAPI;