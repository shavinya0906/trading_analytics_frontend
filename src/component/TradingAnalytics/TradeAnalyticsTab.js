import React, { useEffect, useState } from "react";
import Graph from "./Graphics";
import { useSelector } from "react-redux";

const TradeAnalyticsTab = (props) => {
  const reduxData = useSelector((state) => state);
  const data = reduxData.analytics.data;

  const [convertedData, setConvertedData] = useState([]);
  // const [tradeGraphNames,setTradeGraphNames]=useState()
  const [modifiedData, setModifiedData] = useState([]);

  useEffect(() => {
    if (data) {
      const blankArr = [];
      // for (const [key, value] of Object.entries(data)) {
      //   console.log({ key, value });
      // }
      for (let i = 0; i < Object.entries(data).length; i++) {
        const key = Object.keys(data)[i];
        const values = Object.values(data)[i];
        // console.log(key, Object.values(values));
        let blankObj = { x: "", y: 0 };
        const holdArr = [];
        for (let e = 0; e < Object.entries(values).length; e++) {
          const x = Object.keys(values)[e];
          const y = Object.values(values)[e];
          blankObj = { x, y };
          holdArr.push(blankObj);
        }
        blankArr.push(<Graph name={key} graphData={holdArr} />);
      }
      setModifiedData((pre) => blankArr);
    }
  }, [data]);

  const customData = [
    {
      x: "Jan",
      y: 400,
    },
    {
      x: "Feb",
      y: 430,
    },
    {
      x: "Mar",
      y: 448,
    },
    {
      x: "Apr",
      y: 470,
    },
    {
      x: "May",
      y: 540,
    },
    {
      x: "Jun",
      y: 540,
    },
    {
      x: "Jul",
      y: 540,
    },
  ];

  return (
    <>
      <div className="tradeAnalytics">
        <div className="allGraph">
          {modifiedData.length
            ? modifiedData.map((item, i) => {
                return <div className="eachGraph">{item}</div>;
              })
            : ""}
        </div>
      </div>
    </>
  );
};

export default TradeAnalyticsTab;
