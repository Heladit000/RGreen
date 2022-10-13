import React from "react";
import DiskSpace from "./components/diskspace";
import LiveChart from "./components/liveChart";
import LivePhotos from "./components/livePhotos";

import "./style/live.scss";

const Live = () => {
  return (
    <div>
      <h1 className="history__title">|Semi-real time analytics</h1>
      <LiveChart />
      <section className="live-extraInfo">
        <LivePhotos />
        <DiskSpace />
      </section>
    </div>
  );
};

export default Live;
