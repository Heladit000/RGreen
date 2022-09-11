import express from "express";

import sensorsAPI from "./components/sensors/index.js";
import wateringTimesAPI from "./components/wateringTimes/index.js";
import photosAPI from "./components/photos/index.js";
import configAPI from "./components/config/index.js";
import diskSpaceAPI from "./components/diskspace/index.js";

import { lightAPI } from "./components/light/index.js";

const router = express.Router();

router.use("/sensors", sensorsAPI);
router.use("/wateringTimes", wateringTimesAPI);
router.use("/photos", photosAPI);

router.use("/config", configAPI);
router.use("/diskspace", diskSpaceAPI);

router.use("/light", lightAPI);

export default router;