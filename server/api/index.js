import { getValueWithID, getValuesWithLastTime } from "../database/index.js";
import express from "express";
import config from "../utils/getConfig.js";

import sensorsAPI from "./controllers/sensors/index.js";
import photosAPI from "./controllers/photos/index.js";
import configAPI from "./controllers/config/index.js";

const router = express.Router();

router.use("/sensors", sensorsAPI);
router.use("/photos", photosAPI);
router.use("/config", configAPI);

export default router;