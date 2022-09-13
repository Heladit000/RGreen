import React, { useEffect, useState } from "react";
import config from "@config";
import axios from "axios";
import PlantChart from "../../../../components/plantChart";

import moment from "moment";

const HisoryChart = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(1000);

  const [sensorsData, setSensorsData] = useState({
    soilMoisture: [],
    temperature: [],
    humidity: [],
    date: [],
    wateringTime: [],
  });

  const [wateringTimes, setWateringTimes] = useState([]);
  const [minSoilMoisture, setMinSoilMoisture] = useState([]);

  const [load, setLoad] = useState(false);

  const getSensorsData = () => {
    Promise.all([
      axios
        .get(`${config.server.host}/sensors/${page}?limit=${limit}`)
        .then((data) => {
          const sensorsDataFormatted = sensorsData;

          data.data.body.reverse().map((dataSensor) => {
            sensorsDataFormatted.soilMoisture.push(dataSensor.soilMoisture);
            sensorsDataFormatted.temperature.push(dataSensor.temperature);
            sensorsDataFormatted.humidity.push(dataSensor.humidity);
            sensorsDataFormatted.date.push(moment(dataSensor.date).valueOf());
            sensorsDataFormatted.wateringTime.push(dataSensor.wateringTime);
          });

        }),
      axios
        .get(`${config.server.host}/wateringTimes/${page}?limit=${limit}`)
        .then((dataW) => {
          const wateringTimesFormatted = dataW.data.body
            .reverse()
            .map((dataW) => {
              return {
                x: moment(dataW.date).valueOf(),
                borderColor: "#00E396",
                label: {
                  borderColor: "#00E396",
                  style: {
                    color: "#fff",
                    background: "#00E396",
                  },
                  orientation: "horizontal",
                  text: `${dataW.times} Times`,
                },
              };
            });

          setWateringTimes(wateringTimesFormatted);

          setLoad(true);
        }),
      axios.get(`${config.server.host}/config`).then((dataC) => {
        setMinSoilMoisture([
          {
            y: dataC.data.body.PLANT.min_soil_moisture,
            y2: 0,
            fillColor: "#ff7b0062",
            label: {
              text: "latest min soil moisture",
              style: {
                background:  "#ffa60080"
              }
            },
          },
        ]);

        setLoad(true);
      }),
    ]);
  };

  useEffect(() => {
    getSensorsData();
    setPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <div>
      {load && (
        <div>
          <h1>History</h1>
          <PlantChart
            categories={sensorsData.date}
            colors={["#71EA50", "#EA5050", "#DA50EA"]}
            Xaxis={{
              labels: {
                datetimeUTC: false,
                formatter: (value, timestamp) => {
                  return moment(timestamp).fromNow();
                },
              },
            }}
            annotations={{
              xaxis: wateringTimes,
              yaxis: minSoilMoisture,
            }}
            tooltip={{
              followCursor: true,
              x: {
                format: "dd/MM/yyyy hh:mm",
                formatter: (value, timestamp) => {
                  return moment(value).format("DD/MM/YYYY hh:mm");
                },
              },
            }}
            series={[
              {
                name: "soilMoisture",

                data: sensorsData.soilMoisture,
              },
              { name: "temperature", data: sensorsData.temperature },
              { name: "humidity", data: sensorsData.humidity },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default HisoryChart;
