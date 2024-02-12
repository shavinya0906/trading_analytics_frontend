/* App.js */
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const CurveChart = ({ dataList }) => {
  const [graphData, setGraphData] = useState([]);

  const sortDataBy = (data) => {
    let sortedData;
    const arrayForSort = [...data];
    sortedData = arrayForSort.sort((a, b) => {
      let x = a?.date;
      let y = b?.date;
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
      return 0;
    });
    return sortedData;
    // return sortedData.filter((el, i) => i !== 0);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    return `${day} ${month}'${year}`;
}

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins:{
      legend:{
        display:false,
      },
    },
    scales: {
      x: {
        barThickness: 10,
        ticks: {
          // minRotation: 90,
          // maxRotation: 90,
          // autoSkip: true,
          maxTicksLimit: graphData && graphData?.length/8||8, // Specify the maximum number of ticks you want to display
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
  const data = {
    labels: graphData?.map((data) => formatDate(data.date)),
    datasets: [
      {
        fill: true,
        label: "Account Balance",
        data: graphData.map((data) => data.equity),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        pointRadius: 2.5,
        pointHoverRadius: 4,
        borderWidth: 1.8,
      },
    ],
  };

  useEffect(() => {
    if (dataList?.equityCurveData?.length) {
      const data = sortDataBy(dataList?.equityCurveData);
      console.log(data,"dataaaaa")
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
      <Line options={options} data={data} />
    </div>
  );
};
export default CurveChart;
