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
import { faker } from "@faker-js/faker";
import { useDispatch, useSelector } from "react-redux";
import { tradeLogList } from "../../store/slice/tradeLogSlice";
import { strategyList } from "../../store/slice/strategySlice";
// import { useEffect } from "react";

export function GroupedBarChart({ dataList }) {
  const dispatch = useDispatch();
  const [strategyROI, setStrategyROI] = useState(new Map());
  const token = useSelector((state) => state?.auth?.token);
  const tradeData = useSelector((state) => state?.trades?.data);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const isAddedOrEdited = useSelector(
    (state) => state?.trades?.isAddedOrEdited
  );

  useEffect(() => {
    dispatch(tradeLogList(token));
  }, [isAddedOrEdited === true]);

  useEffect(() => {
    // Step 1: Create a map to store totals
    const strategyTotals = new Map();

    // Step 2: Iterate through trades and update totals
    tradeData.forEach((trade) => {
      const strategy = trade.strategy_used || "NoStrategy"; // Use 'NoStrategy' for trades without a strategy key
      const trade_pnl = trade.trade_pnl || 0; // Use 0 if trade_pnl is not present

      if (!strategyTotals.has(strategy)) {
        strategyTotals.set(strategy, { total: 0, count: 0 });
      }

      const currentTotal = strategyTotals.get(strategy).total;
      const currentCount = strategyTotals.get(strategy).count;

      strategyTotals.set(strategy, {
        total: currentTotal + trade_pnl,
        count: currentCount + 1,
      });
    });

    // Step 3: Calculate ROI for each strategy
    const newStrategyROI = new Map();

    strategyTotals.forEach((value, strategy) => {
      const total = value.total;
      const count = value.count;
      const roi = total / count;

      newStrategyROI.set(strategy, roi);
    });

    // Update the state with the new strategyROI
    setStrategyROI(newStrategyROI);
  }, [tradeData]);

  const options = {
    plugins: {
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rate of Interest',
        },
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
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

  // let labelArr = [];

  const labels = Array.from(strategyROI.keys());
  const roiValues = Array.from(strategyROI.values());

  // Generate an array of colors
  const colors = generateRandomColors(labels.length);

  const datasets = labels.map((strategy, index) => ({
    label: strategy,
    data: [roiValues[index]],
    backgroundColor: colors[index],
  }));

  const data = {
    labels: [""],
    datasets,
  };

  // ... (rest of the code)

  // Function to generate random colors
  function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
      colors.push(color);
    }
    return colors;
  }
  return <Bar options={options} data={data} />;
}
