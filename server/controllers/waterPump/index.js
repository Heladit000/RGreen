import config from "../../utils/getConfig.js"

const handleWaterPump  = (io, soilMoisture) => {
    if(soilMoisture < config.PLANT.min_soil_moisture){
        io.emit("actuators/waterPump", true)
        console.log("\x1b[45m||||| waterPump active ||||\x1b[0m")
    } else {
        io.emit("actuators/waterPump", false)
        //console.log("\x1b[32m||||| waterPump no active ||||\x1b[0m")
    }
}

export default handleWaterPump;