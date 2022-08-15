import { getValueWithID, getValuesRangeValuesWithTime } from "../../../database/index.js";

import config from "../../../utils/getConfig.js";

import express from "express";
import response from "../../utils/response.js";

const photosAPI = express.Router(); 

const TABLE = "photos"

//make image from a image buffer and serve
const servePhoto = async (res, data) => { 

    let img = "";

    if(data.photo !== undefined){
        const b64 = data.photo;
        const buff =  await b64.toString("base64");
        img = await Buffer.from(buff, "base64");
    }

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img);

}

//return images from pages 
photosAPI.get("/:page", (req, res) => {
    getValuesRangeValuesWithTime(TABLE, req.params.page, req.query.limit)
        .then((data) => {
            const sendData = data.map((value) => {
                //link to serve the image
                value.photo = `http://${(config.SERVER.port_forward ? config.SERVER.public_host : config.SERVER.host)}:${config.SERVER.port}/photos/photo/${value.id}`;
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
            //link to serve the image
            response(res, false, { ...data[0], photo: `http://${(config.SERVER.port_forward ? config.SERVER.public_host : config.SERVER.host)}:${config.SERVER.port}/photos/lastphoto/photo` }, 200);
        })
        .catch((err) => {
            response(res, true, err, 500);
        })
})

//serve last Photo
photosAPI.get("/lastphoto/photo", (req, res) => {
    getValuesWithLastTime(TABLE, 1)
        .then((data) => {
            servePhoto(res, data[0])
        })
})

//serve specific
photosAPI.get("/photo/:id", (req, res) => {
    getValueWithID(TABLE, req.params.id)
        .then( async (data) => {
            await servePhoto(res, data[0]);
        })
})

export default photosAPI;
