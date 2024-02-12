import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DailyPnlChart = ({ dataList }) => {
  const [graphData, setGraphData] = useState([]);

  // const sortDataBy = (data) => {
  //   let sortedData;
  //   const arrayForSort = [...data];
  //   sortedData = arrayForSort.sort((a, b) => {
  //     let x = a?.trade_date;
  //     let y = b?.trade_date;
  //     if (x > y) {
  //       return 1;
  //     }
  //     if (x < y) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   return sortedData;
  // };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        barThickness: 10,
        ticks: {
          maxRotation: 0, // Set the maximum rotation to 0 degrees
          minRotation: 0, // Set the minimum rotation to 0 degrees
          autoSkip: true,
          maxTicksLimit: graphData && graphData?.length/3||8,
          font: {
            size: 12, // Adjust font size
            weight: '700', // Adjust font weight
            family: 'DM Sans', // Adjust font family
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks:{
          font: {
            size: 12, // Adjust font size
            weight: '700', // Adjust font weight
            family: 'DM Sans', // Adjust font family
          },
        }
      },
    },
  };
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    return `${day} ${month}'${year}`;
}
  const data = {
    labels:graphData?.map((data) => formatDate(data.trade_date)),
    datasets: [
      {
        label: "Positive Daily PNL",
        data: graphData.map((data) =>
          data.trade_pnl > 0 ? data.trade_pnl : 0
        ),
        backgroundColor: "#01D36E",
      },
      {
        label: "Negative Daily PNL",
        data: graphData.map((data) =>
          data.trade_pnl < 0 ? data.trade_pnl : 0
        ),
        backgroundColor: "#FF0000",
      },
    ],
  };

  useEffect(() => {
    if (dataList?.dailyPnL?.length) {
      const data = dataList?.dailyPnL;
      setGraphData(data);
    }
  }, [dataList]);

  return (
    <div
      style={{
        height: "100%",
        width: graphData.length > 60 ? `${graphData.length * 10}px` : "",
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
};
