import handleSensorsData from "../controllers/sensors/index.js";
import {getLastPhoto,handleCameraData} from "../controllers/camera/index.js";

//socket connection
const startSocketIOConnection = (io) => {
    io.on("connection", (socket) => {

        //when get sensors data
        socket.on("sensorsData", (data) => {
            handleSensorsData(io, data);
        })
    
        //when the camera take a photo
        socket.on("cameraData/send", (data) => {
            handleCameraData(io, data)
        })
    
        getLastPhoto(io);
    })
}


export default startSocketIOConnection;
