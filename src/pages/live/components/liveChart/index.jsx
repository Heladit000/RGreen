import React, { useEffect, useState } from "react";
import moment from "moment";
import config from "@config";

import io from "socket.io-client";
import PlantChart from "../../../../components/plantChart";

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
    <div>
      <PlantChart
        categories={sensorsData.date}
        annotations={{
          points: sensorsData.wateringTime,
        }}
        Xaxis={{
          labels: {
            format: "HH:mm:ss",
            datetimeUTC: false,
          },
        }}
        colors={["#71EA50", "#EA5050", "#DA50EA"]}
        series={[
          {
            name: "soilMoisture",

            data: sensorsData.soilMoisture,
          },
          { name: "temperature", data: sensorsData.temperature },
          { name: "humidity", data: sensorsData.humidity },
        ]}
        tooltip={{
          followCursor: true,
          x: {
            format: "dd/MM/yyyy HH:mm:ss",
          },
        }}
      />
    </div>
  );
};

export default LiveChart;
