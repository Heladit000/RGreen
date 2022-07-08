import express from "express";

import { Server } from "socket.io";
import { createServer } from "http";

import handleSensorsData from "../controllers/sensors/index.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {});

//socket connection
io.on("connection", (socket) => {

    //when get sensors data
    socket.on("sensorsData", (data) => {
        handleSensorsData(io, data);
    })

    //when the camera take a photo
    socket.on("cameraData", (data) => {
        var b64 = data;
        var buff = b64.toString("base64");
        socket.emit("cameraData", buff);
    })
})

export {httpServer , io};
