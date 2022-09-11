import Onoff from "onoff";
import config from "../../../utils/getConfig.js";

//gpio controller
const waterPumpController = new Onoff.Gpio(config.RPICONFIG.water_pump_pin, "out");


const turnOn = () => {
    waterPumpController.writeSync(0);
    
    //turn on quick
    setTimeout(() => {
        turnOff();
    }, 5000);
}

const turnOff = () => {
    waterPumpController.writeSync(1);
}

const waterPump = {
    turnOn,
    turnOff
}

waterPump.turnOff();

//clear GPIO
process.on("SIGINT", async () => {
    await waterPump.turnOff();  
    waterPumpController.unexport();
})

export {waterPump}
