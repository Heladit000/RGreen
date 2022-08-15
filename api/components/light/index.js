import express from "express";
import response from "../../utils/response.js";


const lightAPI = express.Router();

let lightTimes = {
    startTime: "",
    endTime: "",
    hoursOfLight: ""
};

const setLightTime = (startTime, endTime, hoursOfLight) => {
    lightTimes.startTime = startTime,
    lightTimes.endTime = endTime,
    lightTimes.hoursOfLight = hoursOfLight
}

lightAPI.get("/", (req, res) => {
    //return light Period
    response(res,false,lightTimes, 200);
})

export {lightAPI, setLightTime};