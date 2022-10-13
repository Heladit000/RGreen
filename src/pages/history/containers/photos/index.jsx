import axios from "axios";
import React, { useEffect, useState } from "react";
import PhotoCard from "./components/photoCard";

import "./style/photos.scss";

import config from "@config";

import Loading from "@images/loading.gif";

import InfiniteScroll from "react-infinite-scroll-component";

const limit = 10;

const Photos = () => {
  const [imagesData, setImagesData] = useState([]);
  const [page, setPage] = useState(0);
  const [moreDataLoaded, setMoreDataLoaded] = useState(true);


  useEffect(() => {
    //API CALL
    getData();
  }, []);

  

  const getData = () => {
    axios
      .get(`${config.server.host}/photos/${page}?limit=${limit}`)
      .then((data) => {
        setImagesData((lastImageData) => [...lastImageData, ...data.data.body]);

        setPage((lastPage) => lastPage + 1);

        if (data.data.body.length === 0) {
          setMoreDataLoaded(false);
        }
      });
  };

  return (
    <section>
      {imagesData.length > 0 && <h1 className="photos__title">Photos</h1>}
      <InfiniteScroll
        dataLength={imagesData}
        next={getData}
        hasMore={moreDataLoaded}
        loader={<img alt="loading..." src={Loading} />}
        className="photos"
        endMessage={<h1>All photos loaded!</h1>}
      >
        {imagesData.map((image) => {
          return (
            <PhotoCard image={image.photo} key={image.id} date={image.date} />
          );
        })}
      </InfiniteScroll>
    </section>
  );
};

export default Photos;
