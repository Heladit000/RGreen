import Onoff from "onoff";
import config from "../../../utils/getConfig.js";

//control gpio pin
const ArtificialLightController = new Onoff.Gpio(config.RPICONFIG.artificial_light_pin, "out");


const turnOn = () => {
    ArtificialLightController.writeSync(0);
}

const turnOff = () => {
    ArtificialLightController.writeSync(1);
}

const artificialLight = {
    turnOn,
    turnOff
}

artificialLight.turnOff();

//clear GPIO
process.on("SIGINT", async () => {
    await artificialLight.turnOff();
    ArtificialLightController.unexport();
})

export {artificialLight}