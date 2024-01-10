import React from "react";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

const Graph = (props) => {
  const { graphData, name, color, xTitle, yTitle } = props;

  function camelCaseToSpaceSeparated(camelCaseString) {
    return camelCaseString
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str) {
        return str.toUpperCase();
      });
  }

  // Filter out points with y=0
  const filteredGraphData = graphData.filter((item) => item.y !== null && item.y !== 0);

  const data = {
    labels: filteredGraphData.map((item) => item.x),
    datasets: [
      {
        data: filteredGraphData.map((item) => item.y),
        backgroundColor: color,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: xTitle,
          font: {
            family: "DM Sans",
            size: 15,
            weight: 600,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yTitle,
          font: {
            family: "DM Sans",
            size: 15,
            weight: 600,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    barPercentage: 0.5,
  };

  return <Bar data={data} options={options} height={190} />;
};

export default Graph;
