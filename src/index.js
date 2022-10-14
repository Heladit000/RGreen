import React from "react"
import ReactDOM from "react-dom";
import App from "./routes/App";

//global chart configuration
window.Apex = {
    chart: {
        foreColor: "#44AA72",
        background: "#000000"
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
}
ReactDOM.render(
    <App />
    , document.getElementById("root")
);