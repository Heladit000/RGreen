import React, { useEffect, useState } from "react";
import config from "@config";
import axios from "axios";

import moment from "moment";
import ReactApexChart from "react-apexcharts";

import "./style/historyChart.scss";

const HistoryChart = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(1000);

  const [sensorsData, setSensorsData] = useState({
    date: [],
    wateringTime: [],
    soilMoisture: [],
    mixed: {
      soilMoisture: [],
      temperature: [],
      humidity: [],
    },
  });

  const [chartConfig, setChartConfig] = useState({
    formatter: (value, timestamp) => {
      return moment(timestamp).fromNow();
    },
    multipleCharts: {
      colors: ["#71EA50", "#EA5050", "#DA50EA"],
    },
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
            const date = moment(dataSensor.date).valueOf();

            sensorsDataFormatted.soilMoisture.push(dataSensor.soilMoisture);

            sensorsDataFormatted.mixed.soilMoisture.push([
              date,
              dataSensor.soilMoisture,
            ]);

            sensorsDataFormatted.mixed.temperature.push([
              date,
              dataSensor.temperature,
            ]);

            sensorsDataFormatted.mixed.humidity.push([
              date,
              dataSensor.humidity,
            ]);
          });

          return sensorsDataFormatted;
        }),
      axios
        .get(`${config.server.host}/wateringTimes/${page}?limit=${limit}`)
        .then((dataWater) => {
          const wateringTimesFormatted = dataWater.data.body
            .reverse()
            .map((dataWater) => {
              return {
                x: moment(dataWater.date).valueOf(),
                borderColor: "#00E3973B",
                label: {
                  borderColor: "#00E3973B",
                  style: {
                    color: "#fff",
                    background: "#00E3973B",
                  },
                  orientation: "horizontal",
                  text: `${dataWater.times} Times`,
                },
              };
            });

          return wateringTimesFormatted;
        }),
      axios.get(`${config.server.host}/config`).then((dataConfig) => {
        return dataConfig;
      }),
    ]).then((results) => {
      setSensorsData(results[0]);
      setWateringTimes(results[1]);

      setMinSoilMoisture([
        {
          y: results[2].data.body.PLANT.min_soil_moisture,
          y2: Math.min.apply(null, sensorsData.soilMoisture),
          fillColor: "#ff7b0062",
          label: {
            text: "latest min soil moisture",
            offsetY: 20,
            borderWidth: 0,
            style: {
              background: "#ffa60080",
            },
          },
        },
      ]);

      setLoad(true);
    });
  };

  useEffect(() => {
    getSensorsData();
    setPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <div className="historyChart">
      {load && (
        <div>
          <div>
            <h3>Mixed chart</h3>
            <ReactApexChart
              series={[
                {
                  name: "soilMoisture",

                  data: sensorsData.mixed.soilMoisture,
                },
                { name: "temperature", data: sensorsData.mixed.temperature },
                { name: "humidity", data: sensorsData.mixed.humidity },
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
                  type: "line",
                },
                annotations: {
                  xaxis: wateringTimes,
                  yaxis: minSoilMoisture,
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yyyy hh:mm",
                    formatter: (value, timestamp) => {
                      return moment(value).format("DD/MM/YYYY hh:mm");
                    },
                  },
                },
                xaxis: {
                  type: "datetime",
                  categories: sensorsData.date,
                  labels: {
                    datetimeUTC: false,
                    formatter: chartConfig.formatter,
                  },
                },
              }}
            />
          </div>

          {/* Multiple Charts */}
          <div>
            <h3>Individual charts</h3>

            <ReactApexChart
              series={[
                {
                  name: "soil moisture",
                  data: sensorsData.mixed.soilMoisture,
                },
              ]}
              type="line"
              height={200}
              width="98%"
              options={{
                colors: [chartConfig.multipleCharts.colors[0]],
                chart: {
                  id: "soilmoisture",
                  group: "plant",
                  height: 200,
                  type: "line",
                },
                annotations: {
                  xaxis: wateringTimes,
                  yaxis: minSoilMoisture,
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yyyy hh:mm",
                    formatter: (value, timestamp) => {
                      return moment(value).format("DD/MM/YYYY hh:mm");
                    },
                  },
                },
                xaxis: {
                  type: "datetime",
                  categories: sensorsData.date,
                  labels: {
                    datetimeUTC: false,
                    formatter: chartConfig.formatter,
                  },
                },
              }}
            />
            <ReactApexChart
              series={[
                {
                  name: "temperature",
                  data: sensorsData.mixed.temperature,
                },
              ]}
              type="line"
              width="98%"
              height={200}
              options={{
                colors: [chartConfig.multipleCharts.colors[1]],
                chart: {
                  id: "temperature",
                  group: "plant",
                  height: 200,
                  type: "line",
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yyyy hh:mm",
                    formatter: (value, timestamp) => {
                      return moment(value).format("DD/MM/YYYY hh:mm");
                    },
                  },
                },
                xaxis: {
                  type: "datetime",
                  categories: sensorsData.date,
                  labels: {
                    datetimeUTC: false,
                    formatter: chartConfig.formatter,
                  },
                },
              }}
            />

            <ReactApexChart
              series={[
                {
                  name: "humidity",
                  data: sensorsData.mixed.humidity,
                },
              ]}
              width="98%"
              type="line"
              height={200}
              options={{
                colors: [chartConfig.multipleCharts.colors[2]],
                chart: {
                  id: "temperature",
                  group: "plant",
                  height: 200,
                  type: "line",
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yyyy hh:mm",
                    formatter: (value, timestamp) => {
                      return moment(value).format("DD/MM/YYYY hh:mm");
                    },
                  },
                },
                xaxis: {
                  type: "datetime",
                  categories: sensorsData.date,
                  labels: {
                    datetimeUTC: false,
                    formatter: chartConfig.formatter,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryChart;
