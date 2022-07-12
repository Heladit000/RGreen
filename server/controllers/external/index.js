import { spawn } from "child_process"
import path from 'path';

const __dirname = path.resolve();

const cameraPath = `${__dirname}/../controllers/camera/main.py`;
const serialCommunicationPath = `${__dirname}/../controllers/serialComunication/main.py`;
const waterPumpPath = `${__dirname}/../controllers/waterPump/main.py`;
const artificialLightPath = `${__dirname}/../controllers/artificalLight/main.py`;

//exec commands to run external files
class externalController {
    constructor(command, path, name, errorMsg) {
        this.path = path;
        this.name = name;
        this.errorMsg = errorMsg;

        this.spawnController = spawn(command, [path])
    }

    startController() {
        this.spawnController.on("spawn", () => {
            console.log(`\x1b[32m > ${this.name} starting \x1b[0m`)
        })

        this.spawnController.stdout.on("data", (data) => {
            console.log(`\x1b[34m > [${this.name}] ${data.toString()} \x1b[0m`);
        })

        this.spawnController.stderr.on("data", (data) => {
            console.error(`\x1b[31m ${data.toString()}`)
            console.log(`\x1b[41m \x1b[37m [ ERROR ] ----> ${this.errorMsg} <---- \x1b[0m`)
        })
    }
}

const killControllers = (controllersList, code) => {
    Object.entries(controllersList).forEach(([name, proccesController]) => {
        console.log(`\x1b[36m -- ${name} controller procces end \x1b[0m`);
        proccesController.spawnController.kill("SIGINT");
    })


    setTimeout(() => {
        console.log("\x1b[42m RGreen procces end, bye bye \x1b[0m")
        process.exit(code);
    }, 200);
}

//the communication of this controllers is with websockets, for this, start running when the websockets server is on
const startExternalControllers = () => {

    const controllersList = {
        serialCommunication: new externalController("python", serialCommunicationPath, "serial communication controller", "the serial communication not works fine, check the usb connection in 0 port"),
        camera: new externalController("python", cameraPath, "camera controller", "the camera module not works fine, check the camera connection"),
        waterPump: new externalController("python", waterPumpPath, "water pump controller", "the water pump controller not works, check the gpio"),
        artificialLight: new externalController("python", artificialLightPath, "artificial light controller", "the light controller not works, check the gpio")
    }

    controllersList.serialCommunication.startController();
    controllersList.camera.startController();
    controllersList.waterPump.startController();
    controllersList.artificialLight.startController();


    //handle kill the external controllers processes when node.js end
    process.on("SIGINT", () => { killControllers(controllersList, 0) });
    process.on("SIGTERM", () => { killControllers(controllersList, 0) });
}

export default startExternalControllers;