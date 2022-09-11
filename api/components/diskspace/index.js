import express from "express";
import response from "../../utils/response.js";
import checkDiskSpace from "check-disk-space";

const diskSpaceAPI = express.Router();

diskSpaceAPI.get("/", (req, res) => {
    //return disk space
    checkDiskSpace("/")
    .then((diskSpace)=>{
        response(res,false,diskSpace, 200);
    })
    .catch((err)=>{
    response(res,true,err, 500);
    })
})

export default diskSpaceAPI;
