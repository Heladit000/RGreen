import { getValuesWithLastTime } from "../../../database/index.js";
import response from "../../utils/response.js";

import express from "express";

const sensorsAPI = express.Router();

const TABLE = "sensors"

sensorsAPI.get("/", (req, res) => {
    getValuesWithLastTime(TABLE, 10)
        .then((data) => {
            response(res, false, data, 200);
        })
        .catch((err) => {
            response(res, true, "cant get sensors", 500);
        })
})

export default sensorsAPI;