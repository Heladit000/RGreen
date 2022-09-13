import config from '../../utils/getConfig.js';
import moment from 'moment';
import cron from "cron"
import { setLightTime } from '../../api/components/light/index.js';

import { artificialLight } from './controller/index.js';

const CronJob = cron.CronJob;
const startHour = moment().hour(parseInt(config.PLANT.start_hour_period_artificial_light)).minute(0);
const periodHours = parseInt(config.PLANT.period_hours_artificial_light);

const actualHour = moment().minute(0);
const endHour = startHour.clone().add(periodHours, "hours");

let lightState = false;
let lightCronState = false;

const setArtificialLightPeriod = (io) => {

    console.log(`\x1b[42m\x1b[30m || Artifical light period set to ${startHour.hour()}:00 to ${endHour.hour()}:00, ${periodHours} hours of light || \x1b[0m`)

    //choose if turn on or turn off the light with the actual local time
    if (actualHour.isAfter(endHour)) {
        artificialLight.turnOff();
        console.log("\x1b[35m > night period ☽\x1b[0m" + moment().format());
        lightState = false;

        io.emit("actuators/artificialLight", lightState);
    }
    else if (actualHour.isBefore(startHour)) {
        artificialLight.turnOff();
        console.log("\x1b[35m > night period ☽\x1b[0m" + moment().format());
        lightState = false;

        io.emit("actuators/artificialLight", lightState);
    }
    else {
        artificialLight.turnOn();
        console.log("\x1b[33m > light period ☼\x1b[0m" + moment().format());
        lightState = true;

        io.emit("actuators/artificialLight", lightState);
    }


    turnOnArtificialLightJob.start();
    turnOffArtificialLightJob.start();

    //send light configuration to the API
    setLightTime(startHour, endHour, periodHours);
}


//asing cron task to turn on or turn off the ligth in specific hour in all days
const turnOnArtificialLightJob = new CronJob(`0 ${startHour.hour()} * * *`, () => {

    artificialLight.turnOn();
    console.log("\x1b[33m > light period ☼\x1b[0m" + moment().format())
    lightState = true;
    lightCronState = true;

    io.emit("actuators/artificialLight", lightState);

})

const turnOffArtificialLightJob = new CronJob(`0 ${endHour.hour()} * * *`, () => {

    console.log("\x1b[35m > night period ☽\x1b[0m" + moment().format())
    lightState = false;
    lightCronState = false;

    artificialLight.turnOff();

    io.emit("actuators/artificialLight", lightState);

})

const getLightState = () => { return { lightState, lightCronState } };

const getLastLightPeriod = (io) => {
    io.emit("actuators/artificialLight", lightState);
}

export { setArtificialLightPeriod, getLightState, getLastLightPeriod };