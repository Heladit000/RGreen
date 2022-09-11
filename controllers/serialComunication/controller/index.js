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

    //if for random error the arduino is quick turn off go to trying to reconnect
    arduinoPort.on("close", () => {
        //every second
        const reconnectInterval = setInterval(() => {

            console.log("\x1b[41m \x1b[37m [ ERROR ] ----> Arduino connection is closed, trying to reconnect <---- \x1b[0m")
            
            //try to connect
            arduinoPort.open((state) => {

                if (state === null) {
                    console.log("\x1b[32m||||| Arduino connection restored! ||||\x1b[0m")
                    clearInterval(reconnectInterval);
                } else {
                    //if not, trying again
                    console.log(state);
                }
            })
        }, 1000);
    })

    parser.on("data", (data) => {

        let serialData = {}
        //the serial communication with arduino always dont works, for this case have a error handle
        try {
            serialData = JSON.parse(data);
            if (typeof serialData === "object") {
                serialData.date = moment().format();
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
