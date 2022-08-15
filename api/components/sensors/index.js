import { getValuesRangeValuesWithTime } from "../../../database/index.js";
import response from "../../utils/response.js";

import express from "express";

const sensorsAPI = express.Router();

const TABLE = "sensors"

//return history of sensors data with pages
sensorsAPI.get("/:page", (req, res) => {
    getValuesRangeValuesWithTime(TABLE, req.params.page, req.query.limit)
        .then((data) => {
            response(res, false, data, 200);
        })
        .catch((err) => {
            response(res, true, "cant get sensors", 500);
        })
})

export default sensorsAPI;