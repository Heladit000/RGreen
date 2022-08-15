import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import moment from 'moment';

import config from "../../../utils/getConfig.js";

const serialPath = config.RPICONFIG.arduino_route;

const startSerialComunication = (callBack) => {

    //start serial comunication with arduino
    const arduinoPort = new SerialPort({
        path: serialPath,
        baudRate: 9600
    })

    //get the serialPort stream separated with new line
    const parser = arduinoPort.pipe(new ReadlineParser({
        delimiter: "\n",
    }));

    parser.on("data", (data) => {
        let serialData = {}
        //the serial communication with arduino always dont works, for this case have a error handle
        try {
            serialData = JSON.parse(data);
            if (typeof serialData === "object") {
                serialData.date = moment();
            }
        }
        catch {
            serialData = {}
        }

        return callBack(serialData)

    })

    arduinoPort.on("error", () => {
        console.log("\x1b[41m \x1b[37m [ ERROR ] ----> Arduino error, check arduino connection <---- \x1b[0m")
    })

}
export default startSerialComunication;
