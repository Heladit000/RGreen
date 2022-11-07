import React, { useEffect, useState } from "react";

import { createGIF } from "gifshot";

import moment from "moment";

import "./style/plantGif.scss";

const PlantGif = ({ photos }) => {
  const [load, setLoad] = useState(false);

  const [gifSrc, setGifSrc] = useState("");

  const [gifPhotos, setGifPhotos] = useState({
    range: {
      from: "",
      to: "",
    },
    photos: [],
  });

  //active or disable the generate button(Its important the first true to active the button in the first time)
  const [gifGenerated, setGifGenerated] = useState(true);

  const [progress, setProgress] = useState("Click the button to create Gif");

  useEffect(() => {
    //wait photos to create Gif
    if (photos.length > 0) {
      setLoad(true);

      //wait gif to show the range of future gif and update photos
      if (gifGenerated) {
        setGifPhotos({
          ...gifPhotos,
          range: {
            from: photos[photos.length - 1].date,
            to: photos[0].date,
          },
          photos: photos,
        });
      } else {
        //update photos list
        setGifPhotos({
          ...gifPhotos,
          photos: photos,
        });
      }
    }
  }, [photos]);

  const getImageResolution = (imageLink, callback) => {
    const img = new Image();
    img.src = imageLink;

    img.onload = () => {
      //return the image resolution
      callback({
        width: img.width,
        height: img.height,
      });
    };
  };

  const handleGenerateGif = async () => {
    setGifGenerated(false);
    setProgress("preparing...");

    //get only photos links in growing order to add in gifshot
    //create a copy of array ( [...array] ) for not modify the original photos list
    const onlyImagesLink = await [...gifPhotos.photos]
      .reverse()
      .map((image) => {
        return image.photo;
      });

    //get the last image resolution to set the gif resolution
    getImageResolution(onlyImagesLink[onlyImagesLink.length-1], (image) => {
      const gifOptions = {
        //reduce 50% the image resolution for avoid possible page crash
        gifWidth: image.width * 0.5,
        gifHeight: (image.height * (image.width * 0.5)) / image.width,
        images: onlyImagesLink,

        //number of web subprocess
        numWorkers: 4,

        //save "old generated gif"
        saveRenderingContexts: true,

        //track the progress of gif
        progressCallback: (gifProgress) => {
          setProgress(`${Math.ceil(gifProgress * 100)}%`);
        },
      };

      createGIF(gifOptions, (obj) => {
        if (!obj.error) {
          const image = obj.image;

          //get the gif base64 URL
          setGifSrc(image);

          setGifGenerated(true);

          //update future gif date range
          setGifPhotos({
            ...gifPhotos,
            range: {
              from: photos[0].date,
              to: photos[photos.length - 1].date,
            },
          });
        } else {
          console.log("gif error", obj.errorMsg);
        }
      });
    });
  };

  const handleDownloadGif = () => {
    //create a with link
    const downloadLink = document.createElement("a");
    //add base64 data-url in a
    downloadLink.href = gifSrc;

    //preparing to download file
    downloadLink.download = `${moment(gifPhotos.range.from).format(
      "DDMMyyyhhmm"
    )}-${moment(gifPhotos.range.to).format("DDMMyyyhhmm")}`;

    //simulated click a to download the file
    downloadLink.click();
  };

  return (
    <div className="plantGif-container">
      {load && (
        <div className="plantGif">
          <span className="plantGif-panel">
            <p>
              |Scroll to Load more images to {gifSrc.length > 0 && "re-"}
              generate the gif with new images <br /> the page can crash if the
              gif is big.
            </p>
            <button onClick={handleGenerateGif} disabled={!gifGenerated}>
              {gifSrc.length > 0 && "re-"}
              {gifGenerated ? "generate" : "generating"} gif from{" "}
              {moment(gifPhotos.range.from).format("DD/MM/yyyy hh:mm")} to{" "}
              {moment(gifPhotos.range.to).format("DD/MM/yyyy hh:mm")}
            </button>
            {gifGenerated && gifSrc.length > 0 && (
              <button onClick={handleDownloadGif}>Download gif</button>
            )}
          </span>
          {(gifGenerated && gifSrc.length > 0) ? <img src={gifSrc} alt="plant-gif" className="plantGif__gif"/> :
          <h1>{progress}</h1>}
        </div>
      )}
    </div>
  );
};

export default PlantGif;
