import { StillCamera } from "pi-camera-connect";

import moment from "moment";

import { createCanvas, Image } from "canvas";

const imageSize = {
  width: 1920,
  height: 1080,
}

//create canvas to insert the date in the photo
const canvas = createCanvas(imageSize.width, imageSize.height);
const ctx = canvas.getContext("2d");

const RPICamera = new StillCamera(imageSize);

const takePhoto = () => {
  return new Promise((resolve, reject) => {

    let lastImages = {
      dataUrl: "",
      buffer: "",
      err: false
    }

    RPICamera.takeImage()
      .then(async (result) => {

        const img = await new Image();

        //draw camera photo
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };

        img.src = result;

        //-- write the date --
        ctx.fillStyle = "white";
        ctx.font = '30px Impact'
        ctx.fillText(moment().format("DD/MM/YYYY HH:mm:ss"), 20, 50);
        //--------------------

        //get data in base-64
        canvas.toDataURL((err, png) => {
          lastImages.dataUrl = png;

          //get data in buffer
          canvas.toBuffer((err, data) => {
            lastImages.buffer = data;
            resolve(lastImages)

          })
        })

      })
      .catch((err) => {
        reject(lastImages);
        console.log(err);
      });
  })
}


export default takePhoto;
