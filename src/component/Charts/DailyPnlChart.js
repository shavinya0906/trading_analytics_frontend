import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const DailyPnlChart = ({ dataList }) => {
  const [graphData, setGraphData] = useState([]);

  const sortDataBy = (data) => {
    let sortedData;
    const arrayForSort = [...data];
    sortedData = arrayForSort.sort((a, b) => {
      let x = a?.trade_date;
      let y = b?.trade_date;
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
      return 0;
    });
    return sortedData;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Add this line to prevent Y-axis scaling on scroll
    // barWidth:0.5
   
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          font: {
            size: 10,
          },
        },
      },
    },

    
    scales:{
      //setting a minimum bar width if data exceeds too much then bar graph should become horizontal scrollable
      x:{
        barThickness: 10,
        ticks:{
          minRotation: 90,
          maxRotation: 90,
          autoSkip: true,
          maxTicksLimit: 10,
        }
      },
      // x:{
      //   grid:{
      //     display:false,
      //   }
      // },
      y:{
        grid:{
          display:false,
        }
      }

    }
  };

  const data = {
    labels: graphData?.map((data) => data.trade_date),
    datasets: [
      {
        label: "Positive Daily PNL",
        data: graphData.map((data) => (data.trade_pnl > 0 ? data.trade_pnl : 0)),
        backgroundColor: "#01D36E",
      },
      {
        label: "Negative Daily PNL",
        data: graphData.map((data) => (data.trade_pnl < 0 ? data.trade_pnl : 0)),
        backgroundColor: "#FF0000",
      },
    ],
  };

  useEffect(() => {
    if (dataList?.dailyPnL?.length) {
      const data = sortDataBy(dataList?.dailyPnL);
      setGraphData(data);
    }
  }, [dataList]);

  return (
    <Bar options={options} data={data} />
  );
};
