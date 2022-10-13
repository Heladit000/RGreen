import React from "react";
import HistoryChart from "./containers/historyChart";
import Photos from "./containers/photos";

import "./style/history.scss";

const History = () => {
  return (
    <div className="history">
      <h1 className="history__title">|See the history about your plant!</h1>
      <HistoryChart />
      <Photos />
    </div>
  );
};

export default History;
