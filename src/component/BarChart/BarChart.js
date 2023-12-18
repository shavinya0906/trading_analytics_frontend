import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
const BarChart = ({ dataList }) => {
  const label =
    dataList?.dailyPnL?.length &&
    dataList?.dailyPnL?.map(
      (trade) =>
        trade?.trade_date
    );
  const yData =
    dataList?.dailyPnL?.length &&
    dataList?.dailyPnL?.map((trade) =>
      trade.trade_pnl
    );

  const data = {
    labels: label,
    datasets: [
      {
        label: "",
        data: yData,
        backgroundColor: ["rgba(0, 128, 0, 1)"],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        barPercentage: 0.4, // Adjust the bar width as a percentage of the category width
        categoryPercentage: 0.8, 
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <h2>Bar Chart Example</h2>
      <Bar data={data} options={options} height={500} width={500} />
    </div>
  );
};

export default BarChart;
