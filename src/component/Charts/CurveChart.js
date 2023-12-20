/* App.js */
import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
//var CanvasJSReact = require('@canvasjs/react-charts');

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const CurveChart = ({ dataList }) => {
  console.log("changed");
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
    // return sortedData.filter((el, i) => i !== 0);
  };

  useEffect(() => {
    if (dataList?.equityCurveData?.length) {
      const data = sortDataBy(dataList?.equityCurveData);
      console.log("came here againnn")
      console.log(data);
      setDataPoints(
        data.map((el) => ({
          x: new Date(el?.date.toString().slice(0, 10)),
          y: parseInt(el?.equity),
        }))
      );
    }
    else{
      setDataPoints([]);
    }
  }, [dataList]);
  const options = {
    animationEnabled: true,
    // title: {
    //   text: "Monthly Sales - 2017",
    // },
    axisX: {
      valueFormatString: "DD-MMM-YY",
    },
    // axisY: {
    //   title: "Sales (in USD)",
    //   prefix: "$",
    // },
    data: [
      {
        yValueFormatString: "####",
        xValueFormatString: "DDMM",
        type: "area",
        dataPoints: dataPoints,
        // dataPoints: [
        //   { x: new Date(2017, 0, 1), y: 1200 },
        //   { x: new Date(2017, 0, 3), y: 1352 },
        //   { x: new Date(2017, 0, 4), y: 1580 },
        //   { x: new Date(2017, 0, 12), y: 2100 },
        //   { x: new Date(2017, 0, 13), y: 2600 },
        //   { x: new Date(2017, 0, 15), y: 2350 },
        //   { x: new Date(2017, 0, 17), y: 2800 },
        //   { x: new Date(2017, 0, 20), y: 3000 },
        //   { x: new Date(2017, 0, 23), y: 3200 },
        //   { x: new Date(2017, 0, 25), y: 3500 },
        //   { x: new Date(2017, 0, 26), y: 3400 },
        //   { x: new Date(2017, 0, 30), y: 2800 },
        // ],
      },
    ],
  };
  return <CanvasJSChart options={options} />;
};
export default CurveChart;
