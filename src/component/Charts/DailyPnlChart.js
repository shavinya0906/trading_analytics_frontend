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
        // labels: {
        //   boxWidth: 10,
        //   boxHeight: 10,
        //   font: {
        //     size: 10,
        //   },
        // },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "PNL ",
        },
      },
    },
  };

  const data = {
    labels: graphData?.map((data) =>
      new Date(data.trade_date).toLocaleDateString("en-CA")
    ),
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
