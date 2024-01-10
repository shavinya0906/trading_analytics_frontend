import React, { useEffect, useRef, useState } from "react";
import "../TradingAnalytics/tradingAnalytics.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCurrentTab,
  loadingStatus,
  tradeAnalyticsData,
} from "../../store/slice/tradeAnalyticsSlice";
import TradeAnalyticsTab from "./components/TradeAnalyticsTab";
import AdvancedGraph from "./components/AdvancedGraph";

const TradeAnalytics = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state);
  const token = reduxData?.auth?.token;
  const [tradeHeaders, setTradeHeaders] = useState([
    { name: "Overview", active: true, path: "trade/tradeMatrics" },
    { name: "Trade Analytics", active: false, path: "graph/trade-analysis" },
    {
      name: "Performance Analysis",
      active: false,
      path: "graph/performance-analysis",
    },
    { name: "Effort Analysis", active: false, path: "graph/effort-analysis" },
    { name: "Return Analysis", active: false, path: "graph/return-analysis" },
    {
      name: "Drawdown Analysis",
      active: false,
      path: "graph/drawdown-analysis",
    },
    { name: "Advanced", active: false, path: "graph/" },
  ]);
  const [tradeHeadersCurrent, setTradeHeadersCurrent] = useState("Overview");
  const [mainData, setMainData] = useState([]);
  const [path, setPath] = useState("trade/tradeMatrics");

  const converter = (data) => {
    return data.join(",");
  };

  const currentMonthRange = (date) => {
    var firstDayThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDayThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      starting: firstDayThisMonth,
      ending: lastDayThisMonth,
    };
  };
  const currentMonthRangeNew = (date) => {
    const original = new Date(date);
    const year = original.getFullYear();
    const month = original.getMonth() + 1;
    const day = original.getDate();
    const formatDate =
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day);
    return formatDate;
  };

  const monthRange = currentMonthRange(new Date());
  const oldStart = monthRange.starting.toISOString().substring(0, 10);
  const oldEnd = monthRange.ending.toISOString().substring(0, 10);

  const currentStart =
    reduxData.trades?.start && currentMonthRangeNew(reduxData.trades?.start);
  const currentEnd =
    reduxData.trades?.end && currentMonthRangeNew(reduxData.trades?.end);
  const startDate = currentStart || oldStart;
  const endDate = currentEnd || oldEnd;

  let currentMon = new Date().getMonth;
  // reduxData.analytics.monthsName[moment(startDate).format("M")];

  // currentMon = currentMon.slice(0, 3) + " " + moment(startDate).format("YYYY");

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     dispatch(
  //       tradeAnalyticsData({
  //         token,
  //         data: [startDate, endDate],
  //         path,
  //       })
  //     );
  //   }
  // }, [reduxData.trades.end, path]);

  useEffect(() => {
    if (
      reduxData.analytics.data &&
      reduxData.analytics.currentTab == "Overview"
    ) {
      const data = reduxData.analytics.data;
      const blankArr = [];
      for (const [key, value] of Object.entries(data)) {
        //if key is graphs don't push anything to blankArr
        if (key == "graphs") {
          continue;
        }
        //if value is a number then toFixed(2)
        if (typeof value == "number") {
          blankArr.push({ name: key, value: value.toFixed(2) });
        } else blankArr.push({ name: key, value: value });
      }
      setMainData((prev) => blankArr);
    }
  }, [reduxData.analytics.data]);

  useEffect(() => {
    dispatch(loadingStatus(true));
    dispatch(
      tradeAnalyticsData({
        token,
      })
    );
  }, []);

  const currentHeader = (position) => {
    dispatch(addCurrentTab(tradeHeaders[position].name));
    setTradeHeadersCurrent((prev) => tradeHeaders[position].name);
    setPath((prev) => tradeHeaders[position].path);
    setTradeHeaders((prev) => {
      const hold = JSON.parse(JSON.stringify(prev)).map((item, i) => {
        if (i == position) {
          if (!item.active) {
            item.active = true;
          }
        } else {
          item.active = false;
        }
        return item;
      });
      return hold;
    });
  };

  function camelCaseToSpaceSeparated(camelCaseString) {
    // Use a regular expression to insert a space before each capital letter
    return (
      camelCaseString
        .replace(/([A-Z])/g, " $1")
        // Capitalize the first letter
        .replace(/^./, function (str) {
          return str.toUpperCase();
        })
    );
  }

  return (
    <>
      {
        <div className="analytics">
          <div className="tradingAnalyticsHeader">
            <ul className="tradingAnalyticsHeaderList">
              {tradeHeaders.length &&
                tradeHeaders.map((item, i) => {
                  return (
                    <li key={i}>
                      <div
                        className={item.active && "active"}
                        onClick={() => {
                          dispatch(loadingStatus(true));

                          currentHeader(i);
                        }}
                      >
                        {item.name}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
          {tradeHeadersCurrent == "Overview" ? (
            <div className="tradingAnalyticsBodyMiddle">
              <ul>
                <li>
                  <h2>YOUR STATUS</h2>
                  <p>(All Dates)</p>
                </li>
                <li>
                  <div className="analyticsBox">
                    <h3>Best Month</h3>
                    <p className="ammount">
                      $
                      {reduxData.analytics.data["bestMonth"] &&
                        reduxData.analytics.data.bestMonthPnl.toFixed(2)}
                    </p>
                    <p className="fiscal">
                      in {reduxData.analytics.data.bestMonth}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="analyticsBox">
                    <h3>Lowest Month</h3>
                    <p className="ammount">
                      $
                      {reduxData.analytics.data["worstMonth"] &&
                        reduxData.analytics.data.worstMonthPnl.toFixed(2)}
                    </p>
                    <p className="fiscal">
                      in {reduxData.analytics.data.worstMonth}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="analyticsBox">
                    <h3>Average PNL</h3>
                    <p className="ammount">
                      $
                      {reduxData.analytics.data["avgMonthPnl"] &&
                        reduxData.analytics.data.avgMonthPnl.toFixed(2)}
                    </p>
                    <p className="fiscal">per month</p>
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            ""
          )}
          <div className="tradingAnalyticsBody">
            {reduxData.analytics.currentTab == "Overview" ? (
              <ul className="tradingAnalyticsBodyUl">
                {mainData &&
                  mainData.map((item, i) => {
                    return (
                      <li key={i}>
                        <span>{camelCaseToSpaceSeparated(item.name)}</span>
                        <span>
                          {/* &#8377; */}
                          {item.value}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            ) : tradeHeadersCurrent == "Trade Analytics" ? (
              <TradeAnalyticsTab
                data={reduxData.analytics.data.graphs.tradeAnalysisGraphs}
              />
            ) : tradeHeadersCurrent == "Performance Analysis" ? (
              <TradeAnalyticsTab
                data={
                  reduxData.analytics.data.graphs.performanceAnalysisGraphsData
                }
              />
            ) : tradeHeadersCurrent == "Effort Analysis" ? (
              <TradeAnalyticsTab
                data={reduxData.analytics.data.graphs.effortAnalysisGraphsData}
              />
            ) : tradeHeadersCurrent == "Return Analysis" ? (
              <TradeAnalyticsTab
                data={reduxData.analytics.data.graphs.roiAnalysisGraphs}
              />
            ) : tradeHeadersCurrent == "Drawdown Analysis" ? (
              <TradeAnalyticsTab
                data={
                  reduxData.analytics.data.graphs.drawDownAnalysisGraphsData
                }
              />
            ) : tradeHeadersCurrent == "Advanced" ? (
              <AdvancedGraph />
            ) : (
              ""
            )}
          </div>
        </div>
      }
    </>
  );
};

export default TradeAnalytics;
