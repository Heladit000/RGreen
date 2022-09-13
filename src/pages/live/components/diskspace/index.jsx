import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import config from "@config";
import axios from "axios";

const DiskSpace = () => {
  const [load, setLoad] = useState(false);
  const [diskspaceData, setDiskspaceData] = useState({});

  useEffect(() => {
    axios.get(`${config.server.host}/diskspace`).then((data) => {
      setDiskspaceData(data.data.body);
      setLoad(true);
    });
  }, []);

  const changeToGB = number => Math.ceil(number / 1000000000);

  return (
    load && (
      <ReactApexChart
        height="70%"
        width="100%"
        options={{
          chart: {
            type: "radialBar",
            width: 100,
          },
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "75%",
                background: "#000000",
              },
              track: {
                background: "#38F895"
              },
            },
          },
          fill: {
            colors: "#F0492B"
          },
          stroke: {
            lineCap: "round",
          },
          colors: ["#44AA72"],
          labels: [
            `${changeToGB(diskspaceData.free)}G / ${changeToGB(diskspaceData.size)}G of space in the disk`,
          ],
        }}
        type="radialBar"
        series={[Math.ceil((diskspaceData.free * 100) / diskspaceData.size)]}
      />
    )
  );
};
//Math.ceil((diskspaceData.free * 100) / diskspaceData.size)
export default DiskSpace;
