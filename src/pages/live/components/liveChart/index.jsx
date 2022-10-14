import React, { useEffect, useState } from "react";
import moment from "moment";
import config from "@config";

import io from "socket.io-client";

import "./style/live.scss";

import ReactApexChart from "react-apexcharts";

const socket = io(config.server.host);

const maxValues = 20;

const LiveChart = () => {
  const [sensorsData, setSensorsData] = useState({
    soilMoisture: [],
    temperature: [],
    humidity: [],
    date: [],
    wateringTime: [],
  });


  const [chartConfig, setChartConfig] = useState({
    formatter: (value, timestamp) => {
      return moment(timestamp).fromNow();
    },
    multipleCharts: {
      colors: ["#71EA50", "#EA5050", "#DA50EA"],
    },
  });

  useEffect(() => {
    let isMounted = true;

    const updateSensorsData = (data) => {
      let prevData = {};
      if (isMounted)
        setSensorsData((prevSensorsData) => {
          prevData = prevSensorsData;
          return {
            ...prevSensorsData,
            date: [...prevSensorsData.date, moment(data.data.date).valueOf()],
            soilMoisture: [
              ...prevSensorsData.soilMoisture,
              data.data.soilMoisture,
            ],
            temperature: [
              ...prevSensorsData.temperature,
              data.data.temperature,
            ],
            humidity: [...prevSensorsData.humidity, data.data.humidity],
          };
        });

      if (prevData.soilMoisture.length > maxValues) {
        if (isMounted)
          setSensorsData((prevSensorsData) => {
            return {
              ...prevSensorsData,
              date: prevSensorsData.date.slice(1),
              soilMoisture: prevSensorsData.soilMoisture.slice(1),
              temperature: prevSensorsData.temperature.slice(1),
              humidity: prevSensorsData.humidity.slice(1),
            };
          });
      }
    };

    const setWateringTime = () => {
      if (isMounted)
        setSensorsData((prevSensorsData) => {
          return {
            ...prevSensorsData,
            wateringTime: [
              ...prevSensorsData.wateringTime,
              {
                x: prevSensorsData.date[prevSensorsData.date.length - 1],
                y: prevSensorsData.soilMoisture[
                  prevSensorsData.soilMoisture.length - 1
                ],
                borderColor: "#00E396",
                label: {
                  borderColor: "#00E396",
                  style: {
                    color: "#fff",
                    background: "#00E396",
                  },
                  offsetY: 7,
                  text: "WaterPump active!",
                },
              },
            ],
          };
        });
    };

    socket.on("sensorsData", (data) => {
      if (!data.error) {
        if (isMounted) updateSensorsData(data);
      }
    });

    socket.on("actuators/waterPump", (data) => {
      if (data) {
        if (isMounted) setWateringTime();
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="live">

      <ReactApexChart
              series={[
                {
                  name: "soilMoisture",
                  data: sensorsData.soilMoisture,
                },
                { name: "temperature", data: sensorsData.temperature },
                { name: "humidity", data: sensorsData.humidity },
              ]}
              type="line"
              width="98%"
              height={300}
              options={{
                colors: chartConfig.multipleCharts.colors,
                chart: {
                  id: "all",
                  group: "plant",
                  height: 300,
                  width: "98%",
                  type: "line",
                },
                annotations: {
                  points: sensorsData.wateringTime,
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yyyy hh:mm",
                  },
                },
                xaxis: {
                  type: "datetime",
                  categories: sensorsData.date,
                  labels: {
                    datetimeUTC: false,
                  },
                },
              }}
            />
    </div>
  );
};

export default LiveChart;
