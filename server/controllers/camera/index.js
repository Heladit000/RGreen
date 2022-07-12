import { insertValue } from "../../database/index.js"
import moment from 'moment';

let lastPhoto = "";

const TABLE = "photos"

const sioEvent = "cameraData";

const getLastPhoto = (io) => {
    if (lastPhoto.length !== 0) {
        io.emit(sioEvent, lastPhoto);
    }
}

const handleCameraData = (io, data) => {
    const b64 = data;
    const buff = b64.toString("base64");
    lastPhoto = buff;

    io.emit(sioEvent, lastPhoto);
}

const saveCameraData = () => {
    insertValue(TABLE, "photo", lastPhoto)
        .then((data) => {
            console.log(`\x1b[36m -- Photo data saved in database ${moment().format()}\x1b[0m`);
        }).catch((err) => {
            console.log(`x1b[31m -- Cant save Photo data in database  ${moment().format()}\x1b[0m`);
        })
}

export { getLastPhoto, handleCameraData, saveCameraData };