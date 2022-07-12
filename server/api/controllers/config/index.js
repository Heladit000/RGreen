import config from "../../../utils/getConfig.js";

import express from "express";
import response from "../../utils/response.js";

const configAPI = express.Router(); 

configAPI.get("/", (req, res) => {
    response(res, true, config, 200);
})

export default configAPI;