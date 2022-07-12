import config from '../../utils/getConfig.js';
import moment from 'moment';
import cron from "cron"
import { saveCameraData } from '../camera/index.js';

const CronJob = cron.CronJob;
const startHour = moment().hour(parseInt(config.PLANT.start_hour_period_artificial_light)).minute(0);
const periodHours = parseInt(config.PLANT.period_hours_artificial_light);

const sioEvent = "actuators/artificialLight";

const setArtificialLightPeriod = (io) => {


    let state = false;

    io.on("connection", (socket) => {
        io.emit(sioEvent, state)
    })

    const actualHour = moment().minute(0);
    const endHour = startHour.clone().add(periodHours, "hours");

    console.log(`\x1b[42m\x1b[30m || Artifical light period set to ${startHour.hour()}:00 to ${endHour.hour()}:00, ${periodHours} hours of light || \x1b[0m`)

    //choose if turn on or turn off the light with the actual local time
    if (actualHour.isAfter(endHour)) {
        state = false;
        console.log("\x1b[35m > night period ☽\x1b[0m" + moment().format());
    }
    else if (actualHour.isBefore(startHour)) {
        state = false;
        console.log("\x1b[35m > night period ☽\x1b[0m" + moment().format());
    }
    else {
        state = true
        console.log("\x1b[33m > light period ☼\x1b[0m" + moment().format());

        //one minute delay to save one photo every day
        setTimeout(() => {
            saveCameraData();
        }, 6000)
    }

    //asing cron task to turn on or turn off the ligth in specific hour in all days
    const turnOnArtificialLightJob = new CronJob(`0 ${startHour.hour()} * * *`, () => {

        state = true;

        io.emit(sioEvent, state)
        console.log("\x1b[33m > lightCron light period ☼\x1b[0m" + moment().format())

        //if the message not sent in the first time
        setTimeout(() => {
            io.emit(sioEvent, state)
        }, 1000);

        //one minute delay to save one photo every day
        setTimeout(() => {
            saveCameraData();
        }, 6000)
    })

    const turnOffArtificialLightJob = new CronJob(`0 ${endHour.hour()} * * *`, () => {

        state = false;

        console.log("\x1b[35m > night period ☽\x1b[0m" + moment().format())
        io.emit(sioEvent, state)

        //if the message not sent in the first time
        setTimeout(() => {
            io.emit(sioEvent, state)
        }, 1000);
    })

    turnOnArtificialLightJob.start();
    turnOffArtificialLightJob.start();
}

export default setArtificialLightPeriod;