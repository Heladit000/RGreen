import startExternalControllers from "./controllers/external/index.js";
import {httpServer, io} from "./websockets/index.js";
import config from "./utils/getConfig.js";
import figlet from "figlet"
import setArtificialLightPeriod from "./controllers/artificialLight/index.js";

//--Cool text test--
process.stdout.write('\x1Bc'); 
console.log(`\x1b[32m${figlet.textSync("RGreen", { font: "3D-ASCII"})}\x1b[0m`)
//-------------------


httpServer.listen(3000, () => {
    console.log(`Socket connection running in ${3000} port`)

    //start websocket connection with external controllers
    startExternalControllers();
    setArtificialLightPeriod(io)
});