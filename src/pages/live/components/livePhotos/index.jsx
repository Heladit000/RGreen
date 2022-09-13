import React, { useEffect, useState } from "react";

import io from "socket.io-client";
import Photo from "./components/photo";
import config from "@config";

import "./style/livePhotos.scss";

const socket = io(config.server.host);

const LivePhotos = () => {

  let isMounted = true;

  const [imageData, setImageData] = useState(new Array(5).fill(undefined));

  useEffect(() => {
    const updateImageData = (dataUrl) => {
      if(isMounted) setImageData((prevImageData) => {
        return [...prevImageData.slice(1), dataUrl];
      });
    };

    socket.on("cameraData", (dataUrl) => {
      if(isMounted) updateImageData(dataUrl);
    });
    
    return () => {
      isMounted = false;
    }
  }, []);
  return (
    <div className="livePhotos-container"> 
      <div className="livePhotos">
        <section className="livePhotos-oldPreviews">
          <Photo dataUrl={imageData[0]} />
          <Photo dataUrl={imageData[1]} />
          <Photo dataUrl={imageData[2]} />
          <Photo dataUrl={imageData[3]} />
        </section>
        <Photo externalClass="livePhotos__livePreview" dataUrl={imageData[4]} />
      </div>
    </div>
  );
};

export default LivePhotos;
