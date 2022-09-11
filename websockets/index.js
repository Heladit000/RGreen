import {getLastSensorsData, handleSensorsData} from "../controllers/serialComunication/index.js";
import {getLastPhoto,handleCameraData} from "../controllers/camera/index.js";

//socket connection
const startSocketIOConnection = (io) => {

    //start cron Jobs 
    handleSensorsData(io);
    handleCameraData(io);

    io.on("connection", (socket) => {
        getLastPhoto(io);
        getLastSensorsData(io);
    })
}


export default startSocketIOConnection;
