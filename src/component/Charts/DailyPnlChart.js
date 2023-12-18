import React from "react";
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
import { faker } from "@faker-js/faker";

export function DailyPnlChart({ dataList }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Bar Chart - Stacked",
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  //   const labels = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //   ];

  let labelArr = [];

  const labels = dataList?.strategies?.map((el) => {
    if (labelArr?.includes(el.month)) {
      return null;
    } else {
      labelArr.push(el.month);
      return el.month;
    }
  }).filter((el) => el !== null);

  //   console.log(labels?.map(() => faker.datatype.number({ min: 0, max: 1000 })));

  const data = {
    labels,
    datasets: [
      {
        label: "Strategy 1",
        data: labels?.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        backgroundColor: "#0075FF",
        stack: "Stack 0",
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
