import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import config from "@config";
import axios from "axios";

import "./style/diskspace.scss"

const DiskSpace = () => {
  const [load, setLoad] = useState(false);
  const [diskspaceData, setDiskspaceData] = useState({});

  useEffect(() => {
    axios.get(`${config.server.host}/diskspace`).then((data) => {
      setDiskspaceData(data.data.body);
      setLoad(true);
    });
  }, []);

  const changeToGB = (number) => Math.ceil(number / 1000000000);

  return (
    load && (
      <div className="diskSpace-container">
        <ReactApexChart
          width="100%"
          height="100%"
          options={{
            responsive: [
              {
                breakpoint: 600,
                options: {},
              },
            ],
            plotOptions: {
              radialBar: {
                hollow: {
                  margin: 0,
                  size: "80%",
                },
                track: {
                  background: "#38F895",
                },
              },
            },
            fill: {
              colors: "#082316",
            },
            stroke: {
              lineCap: "round",
            },
            colors: ["#44AA72"],
            labels: [
              `${changeToGB(diskspaceData.free)}G / ${changeToGB(
                diskspaceData.size
              )}G of space in the disk`,
            ],
          }}
          type="radialBar"
          series={[Math.ceil((diskspaceData.free * 100) / diskspaceData.size)]}
        />
      </div>
    )
  );
};
//Math.ceil((diskspaceData.free * 100) / diskspaceData.size)
export default DiskSpace;
