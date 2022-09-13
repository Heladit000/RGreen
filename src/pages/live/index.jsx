import React from "react";
import DiskSpace from "./components/diskspace";
import LiveChart from "./components/liveChart";
import LivePhotos from "./components/livePhotos";

import "./style/live.scss";

const Live = () => {
  return (
    <div>
      <LiveChart />
      <section className="live-extraInfo">
        <LivePhotos />
        <DiskSpace />
      </section>
    </div>
  );
};

export default Live;
