import { insertValues } from "../../database/index.js";
import handleWaterPump from "../waterPump/index.js";
import moment from 'moment';
import cron from "cron";

const CronJob = cron.CronJob;


const TABLE = "sensors";

const sioEvent = "sensorsData"; 

let lastSensorsData = {};
const hoursSaveSensorsData = 3;

const handleSensorsData = async (io, data) => {

    let sensors = {
        error: false,
        data: {}
    }

    //the serial communication with arduino always dont works, for this case have a error handle
    try {
        sensors.data = JSON.parse(data);
        sensors.error = false

        if (typeof sensors.data !== "object") {
            sensors.error = true
        } else {
            sensors.error = false

            if(Object.keys(lastSensorsData).length === 0){
                lastSensorsData = await sensors;

                await saveSensorsData(sensors);
   
                await startSaveJobSensorsData.start();
            }
            
            lastSensorsData = sensors
        }
    }
    catch {
        sensors.error = true
    }

    io.emit(sioEvent, lastSensorsData);

    if (!sensors.error) {
        //console.table(lastSensorsData.data)

        handleWaterPump(io, lastSensorsData.data.soilMoisture)
    }
}

const saveSensorsData = () => {
    insertValues(TABLE, lastSensorsData.data)
    .then((data) => {
        console.log(`\x1b[36m -- Sensors data saved in database ${moment().format()}\x1b[0m`);
    }).catch((err) => {
        console.log(`\x1b[31m -- Cant save sensors data in database ${moment().format()}  \x1b[0m`);
    })
}

const startSaveJobSensorsData = () => {
    const saveJobSensorsData = new CronJob(`0 */${hoursSaveSensorsData} * * *`, () => {
        saveSensorsData();
    })
}


export default handleSensorsData;