import handleWaterPump from "../waterPump/index.js";

const handleSensorsData = (io, data) => {

    let sensors = {
        error: false,
        data: {}
    }

    //the serial communication with arduino always dont works, for this case have a error handle
    try {
        sensors.data = JSON.parse(data);
        sensors.error = false
        
        if (typeof sensors.data !== "object") {
            sensors.error = true
        } else {
            sensors.error = false
        }
    }
    catch {
        sensors.error = true
    }

    io.emit("sensorsData", sensors);

    if (!sensors.error) {
        console.table(sensors.data)
        handleWaterPump(io, sensors.data.soilMoisture)
    }
}

export default handleSensorsData;