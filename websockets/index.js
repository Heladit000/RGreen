import {getLastSensorsData, handleSensorsData} from "../controllers/serialComunication/index.js";
import {getLastPhoto,handleCameraData} from "../controllers/camera/index.js";
import { getLastLightPeriod, setArtificialLightPeriod } from "../controllers/artificialLight/index.js";

//socket connection
const startSocketIOConnection = (io) => {

    //start cron Jobs 
    setArtificialLightPeriod(io);
    handleSensorsData(io);
    handleCameraData(io);

    io.on("connection", (socket) => {
        getLastPhoto(io);
        getLastSensorsData(io);
        getLastLightPeriod(io);
    })
}


export default startSocketIOConnection;
