import { getValueWithID, getValuesWithLastTime } from "../../../database/index.js";

import config from "../../../utils/getConfig.js";

import express from "express";
import response from "../../utils/response.js";

const photosAPI = express.Router(); 

const TABLE = "photos"


const servePhoto = (res, data) => { 

    let img = "";

    if(data.photo !== undefined){
        const b64 = data.photo;
        const buff = b64.toString("base64");
        img = Buffer.from(buff, "base64");
    }

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img);
    
}

photosAPI.get("/", (req, res) => {
    getValuesWithLastTime(TABLE, 10)
        .then((data) => {
            const sendData = data.map((value) => {
                value.photo = `http://${config.SERVER.public_host}:${config.SERVER.port}/photos/${value.id}`;
                return value;
            })
            
            response(res, false, sendData, 200);
        })
        .catch((err) => {
            response(res, true, err, 500);
        })
})



photosAPI.get("/lastphoto", (req, res) => {
    getValuesWithLastTime(TABLE, 1)
        .then((data) => {
            response(res, false, { ...data[0], photo: `http://${config.SERVER.public_host}:${config.SERVER.port}/photos/lastphoto/photo` }, 200);
        })
        .catch((err) => {
            response(res, true, err, 500);
        })
})

photosAPI.get("/lastphoto/photo", (req, res) => {
    getValuesWithLastTime(TABLE, 1)
        .then((data) => {
            servePhoto(res, data[0])
        })
})

photosAPI.get("/:id", (req, res) => {
    getValueWithID(TABLE, req.params.id)
        .then((data) => {
            servePhoto(res, data[0]);
        })
})

export default photosAPI;
