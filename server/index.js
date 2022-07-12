import express from "express";
import cors from "cors";

import { Server } from "socket.io";
import { createServer } from "http";
import router from "./api/index.js";

import startExternalControllers from "./controllers/external/index.js";
import startSocketIOConnection from "./websockets/index.js";
import config from "./utils/getConfig.js";
import figlet from "figlet"
import setArtificialLightPeriod from "./controllers/artificialLight/index.js";

import { startDBConnection } from "./database/index.js";


//--Cool text test--
process.stdout.write('\x1Bc');
console.log(`\x1b[32m${figlet.textSync("RGreen", { font: "3D-ASCII" })}\x1b[0m`)
//-------------------

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        credentials: true
    }
});

app.use("/", router);

//--test dashboard -delete it--
app.use('/testdashboard', express.static('public'));

app.get("/testdashboard", (req,res) => {
    res.sendFile("./public/index.html");
})
//-----------------------------

httpServer.listen(config.SERVER.port, async () => {
    console.log(`Socket connection running in http://${config.SERVER.public_host}:${config.SERVER.port}`)

    await startSocketIOConnection(io);

    await startDBConnection();

    //start websocket connection with external controllers
    await startExternalControllers();

    await setArtificialLightPeriod(io);

});
