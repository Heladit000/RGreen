import express from "express";

import sensorsAPI from "./components/sensors/index.js";
import photosAPI from "./components/photos/index.js";
import configAPI from "./components/config/index.js";
import { lightAPI } from "./components/light/index.js";

const router = express.Router();

router.use("/sensors", sensorsAPI);
router.use("/photos", photosAPI);
router.use("/config", configAPI);
router.use("/light", lightAPI);

export default router;