import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
export const DailyPnlChart = ({ dataList }) => {
  const [dataPoints, setDataPoints] = useState([]);

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
  };

  useEffect(() => {
    if (dataList?.dailyPnL?.length) {
      const data = sortDataBy(dataList?.dailyPnL);
      console.log(data);
      setDataPoints(
        data.map((el) => ({
          x: new Date(el?.trade_date.toString().slice(0, 10)),
          y: parseInt(el?.trade_pnl),
        }))
      );
    }
  }, [dataList]);
  const options = {
    animationEnabled: true,
    axisX: {
      valueFormatString: "DD-MMM-YY",
    },
    data: [
      {
        yValueFormatString: "####",
        xValueFormatString: "DDMM",
        type: "column",
        dataPoints: dataPoints,
      },
    ],
  };
  return <CanvasJSChart options={options} />;
};
