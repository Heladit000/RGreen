import moment from 'moment';

import { insertValues } from "../../database/index.js";
import { waterPump } from './controller/index.js';
import config from "../../utils/getConfig.js"

const TABLE = "watering_times";

let times = 0;
let startSoilMoisture = 0;
let startWatering = false;


//insert in database waterTimer information
const saveWateringTimes = () => {

    const dataToInsert = {
        soilMoisture: startSoilMoisture,
        times
    }

    insertValues(TABLE, dataToInsert)
        .then((data) => {
            console.log(`\x1b[36m -- Watering time saved in database ${moment().format()}\x1b[0m`);
        }).catch((err) => {
            console.log(err)
            console.log(`\x1b[31m -- Watering time cant saved in database ${moment().format()}  \x1b[0m`);
        })

    times = 0;
}

//Water plant until it reaches its maximum point established in configuration
const handleWaterPump = async (io, soilMoisture) => {

    waterPump.turnOff();

    if (soilMoisture < config.PLANT.min_soil_moisture && startWatering === false) {
        startWatering = true;
    }

    if (startWatering) {
        if (soilMoisture < config.PLANT.max_soil_moisture) {
            startSoilMoisture = config.PLANT.min_soil_moisture;

            await times++;

            await io.emit("actuators/waterPump", true);

            waterPump.turnOn();

            console.log("\x1b[45m||||| waterPump active ||||\x1b[0m");

        } else {

            //in the maximum point
            startWatering = false;
            
            await io.emit("actuators/waterPump", false)

            waterPump.turnOff();

            console.log(times);

            await saveWateringTimes();

            console.log("\x1b[32m||||| waterPump no active ||||\x1b[0m")
        }
    }

}

export default handleWaterPump;