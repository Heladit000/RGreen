import React from "react";
import Charts from "react-apexcharts";

const PlantChart = ({ categories, Xaxis, annotations, colors, series , tooltip }) => {
  return (
    <div>
      <Charts
        width="98%"
        height="220%"
        options={{
          annotations: annotations,
          stroke: {
            width: 4,
            curve: "smooth"
          },
          chart: {
            width: 100,
            id: "realtime",
            type: "line",
            foreColor: "#44AA72",
          },
          grid: {
            show: true,
            borderColor: "#2B6C48",
            strokeDashArray: 1,
            position: "back",
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: true,
              },
            },
            row: {
              opacity: 0.5,
            },
            column: {
              opacity: 0.5,
            },
          },
          noData: {
            align: "center",
            text: "Loading...",
          },
          
          xaxis: { ...{
            type: "datetime",
            categories,
          }, ...Xaxis},

          yaxis: {
            min: 0,
            max: 100,
          },
          tooltip: {...tooltip},

          colors: colors,
        }}
        series={series}
      />
    </div>
  );
};

export default PlantChart;
