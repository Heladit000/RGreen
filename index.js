import express from "express";
import cors from "cors";

import { Server } from "socket.io";
import { createServer } from "http";
import router from "./api/index.js";

import startSocketIOConnection from "./websockets/index.js";
import config from "./utils/getConfig.js";
import figlet from "figlet"

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

//--test dashboard--
app.use('/testdashboard', express.static('public'));

app.get("/testdashboard", (req, res) => {
    res.sendFile("./public/index.html");
})
//-----------------------------s

httpServer.listen(config.SERVER.port,async () => {
        console.log(`Server connection running in http://${(config.SERVER.port_forward ? config.SERVER.public_host : config.SERVER.host)}:${config.SERVER.port}`)
       
        await startSocketIOConnection(io);
        await startDBConnection();
});
