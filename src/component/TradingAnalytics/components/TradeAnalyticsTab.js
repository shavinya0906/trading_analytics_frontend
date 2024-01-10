import React, { useEffect, useState } from "react";
import Graph from "./Graphics";
import { useSelector } from "react-redux";

const TradeAnalyticsTab = ({ data }) => {
  const [modifiedData, setModifiedData] = useState([]);
  const colorsArray = [
    "#86E8D0",
    "#FFBC99",
    "#F5BCE9",
    "#B5E4CA",
    "#C3B6F6",
    "#FFBE5E",
  ];

  useEffect(() => {
    if (data) {
      const convertedData = Object.entries(data).map(([key, values], index) => {
        if (key === "titlesArray") {
          return null; // Skip rendering for titlesArray
        }

        const titlesArray = data.titlesArray;
        const xTitle = titlesArray[index].x;
        const yTitle = titlesArray[index].y;

        return (
          <div className="col-md-6 col-12 chat-card" key={key}>
            <div className="card" style={{marginBottom:"40px"}}>
              <div className="card-body" style={{marginBottom:"20px"}}>
                <Graph
                  name={key}
                  graphData={values}
                  color={colorsArray[index % colorsArray.length]}
                  xTitle={xTitle}
                  yTitle={yTitle}
                />
              </div>
            </div>
          </div>
        );
      });

      setModifiedData(convertedData.filter(Boolean)); // Filter out null values
    }
  }, [data]);

  return (
    <div className="row mt-5 main-card-wrap">
      {modifiedData.length ? modifiedData : "No data available"}
    </div>
  );
};

export default TradeAnalyticsTab;
