import fs from "fs";
import ini from "ini";

const configPath = "../config.ini";
const config = ini.parse(fs.readFileSync(configPath, "utf-8"));

export default config;
