import { insertValue } from "../../database/index.js"
import moment from 'moment';
import { saveSensorsData } from "../serialComunication/index.js";
import takePhoto from "./controller/index.js";
import { CronJob } from "cron";

import { getLightState } from "../artificialLight/index.js";

const TABLE = "photos"

const sioEvent = "cameraData";

let lastPhotos = {};

//when a client connect. emit the last photo
const getLastPhoto = (io) => {
    if (Object.keys(lastPhotos).length !== 0) {
        io.emit(sioEvent, lastPhotos.dataUrl);
    }
}

const cameraSeconds = 10;
let dailyPhoto = false;

//take every seconds a photo and emit in data-url and save in buffer in the database
const handleCameraData = (io) => {

    const updateJobPhotos = new CronJob(`*/${cameraSeconds} * * * * *`, async () => {
        await takePhoto().then(async (data) => {

            if (Object.keys(lastPhotos).length === 0) {
                lastPhotos = data

                if (getLightState().lightState) {
                    saveCameraData();
                }
            }

            lastPhotos = data

            io.emit(sioEvent, lastPhotos.dataUrl);

            //take daily photo when the lights turns on
            if (getLightState().lightCronState) {
                if (!dailyPhoto) {
                    saveCameraData();
                    dailyPhoto = true;
                }
            } else {
                dailyPhoto = false
            }

        }).catch(() => {
            console.log("\x1b[41m \x1b[37m [ ERROR ] ----> camera controller", "the camera module not works fine, check the camera connection <---- \x1b[0m");
        })
    })

    updateJobPhotos.start();

}

const saveCameraData = () => {
    insertValue(TABLE, "photo", lastPhotos.buffer)
        .then((data) => {
            console.log(`\x1b[36m -- Photo data saved in database ${moment().format()}\x1b[0m`);
            saveSensorsData(true);
        }).catch((err) => {
            console.log(`x1b[31m -- Cant save Photo data in database  ${moment().format()}\x1b[0m`);
        })
}

export { getLastPhoto, handleCameraData, saveCameraData };
