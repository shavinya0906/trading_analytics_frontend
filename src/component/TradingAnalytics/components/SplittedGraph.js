import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export function SplittedBarGraph({ dataList, xAxis }) {
  const [strategyROI, setStrategyROI] = useState({});

  useEffect(() => {
    if (dataList) {
      const strategies = structuredClone(dataList);
      setStrategyROI(strategies);
    }
  }, [dataList]);

  const options = {
    plugins: {
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: xAxis,
        },
      },
      y: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "No. of trades",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  const datasets = Object.values(strategyROI).map((strategyData) => {
    const filteredData = strategyData.data.filter(
      (dataPoint) => dataPoint.y !== null && dataPoint.y !== 0
    );

    return {
      ...strategyData,
      data: filteredData,
    };
  });

  const data = {
    datasets,
  };

  return <Bar options={options} data={data} height={390} />;
}
