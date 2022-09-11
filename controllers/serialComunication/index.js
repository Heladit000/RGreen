import { insertValues } from "../../database/index.js";
import handleWaterPump from "../waterPump/index.js";
import moment from 'moment';
import cron from "cron";
import config from "../../utils/getConfig.js";

import startSerialComunication from "./controller/index.js";

const CronJob = cron.CronJob;


const TABLE = "sensors";

const sioEvent = "sensorsData";

let sensors = {
    error: false,
    date: "",
    data: {}
}

const hoursSaveSensorsData = config.PLANT.every_hours_save_sensors_data;

const handleSensorsData = async (io) => {
    //this function is called when arduino send data
    startSerialComunication((data) => {
        //if is no object
        if (Object.keys(data).length === 0) {
            sensors.error = true;
        } else {

            //detect the first time to save data and start cron job
            if (Object.keys(sensors.data).length === 0) {

                sensors.data = data;

                saveSensorsData(false)
                saveJobSensorsData.start();

            }

            sensors.error = false;
            sensors.data = data;

            console.table(sensors.data)

            //emit data
            io.emit(sioEvent, sensors);
        }


        if (!sensors.error && Object.keys(sensors.data).length !== 0) {
            handleWaterPump(io, sensors.data.soilMoisture);
        }
    });
}

const saveSensorsData = (cameraState) => {
    insertValues(TABLE, { ...sensors.data, camera: cameraState })
        .then(() => {
            console.log(`\x1b[36m -- Sensors data saved in database ${moment().format()}\x1b[0m`);
        }).catch((err) => {
            console.log(err);
            console.log(cameraState);
            console.log(`\x1b[31m -- Cant save sensors data in database ${moment().format()}  \x1b[0m`);
        })
}

//when the client connect ssend the last sensors data
const getLastSensorsData = (io) => {
    io.emit(sioEvent, sensors);
}

//start cron job to save every hours dataSensors in database
const saveJobSensorsData = new CronJob(`0 */${hoursSaveSensorsData} * * *`, () => {
    saveSensorsData(false);
})

export { handleSensorsData, saveSensorsData, getLastSensorsData };