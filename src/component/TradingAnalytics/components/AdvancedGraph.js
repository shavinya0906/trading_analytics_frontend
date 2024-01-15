import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getAdvancedGraphData } from "./../../../store/slice/tradeAnalyticsSlice";
import Graph from "./Graphics";
import { SplittedBarGraph } from "./SplittedGraph";

const AdvancedGraph = () => {
  const [dataType, setDataType] = useState("");
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state);
  const token = reduxData?.auth?.token;
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  const [chartData, setChartData] = useState();

  const axisOptionsMap = {
    AssetClass: [
      "PositionSize",
      "Conviction",
      "PNL",
      "PercentageOfAccountRisked",
      "Karma",
      "NetROI",
      "Charges",
    ],
    StrategyUsed: [
      "Conviction",
      "RiskReward",
      "PNL",
      "Karma",
      "NetROI",
      "Charges",
    ],
    Conviction: ["PNL", "Karma", "NetROI"],
    Karma: ["PNL", "NetROI"],
    HoldingTradeType: ["PNL", "Karma", "Conviction", "NetROI", "Charges"],
    PercentageOfAccountRisked: ["PNL", "Karma", "NetROI"],
  };
  const [xOptions, setXOptions] = useState(Object.keys(axisOptionsMap));
  const [yOptions, setYOptions] = useState([]);

  useEffect(() => {
    if (xAxis && yAxis) {
      const payloadUrl = `?xAxis=${xAxis}&yAxis=${yAxis}`;
      dispatch(getAdvancedGraphData({ token: token, values: payloadUrl }));
    }
  }, [xAxis, yAxis]);

  useEffect(() => {
    if (reduxData.analytics.data?.graphs?.getAdvancedGraphData) {
      let typee = "";
      const { type, datasets } =
        reduxData.analytics.data.graphs.getAdvancedGraphData;

      if (type === "splittedBarGraph" && Array.isArray(datasets)) {
        const chartData = datasets.map((item) => ({
          label: item.label, // Assuming your data structure has a 'label' property
          data: item.data.map((dataPoint) => ({
            x: dataPoint.x,
            y: dataPoint.y,
          })),
        }));
        console.log(chartData);
        setChartData(chartData);
        setDataType(type);
      } else {
        const chartData =
          reduxData.analytics.data?.graphs?.getAdvancedGraphData?.map(
            (item) => ({
              x: item.x,
              y: item.y,
            })
          );
        setChartData(chartData);
      }
    }
  }, [reduxData.analytics.data?.graphs?.getAdvancedGraphData]);

  const fetchDataFromAPI = async (x, y) => {
    return {
      labels: ["Category 1", "Category 2", "Category 3"],
      datasets: [
        {
          label: `${x} vs ${y}`,
          data: [12, 19, 3],
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const updateChartData = (data) => {
    setChartData(data);
  };

  const handleXChange = (selectedX) => {
    setXAxis(selectedX);
    const filteredYOptions = axisOptionsMap[selectedX] || [];
    setYOptions(filteredYOptions);
  };

  const handleYChange = (selectedY) => {
    setYAxis(selectedY);
    setDataType('');
    const filteredXOptions = Object.keys(axisOptionsMap).filter((option) =>
      axisOptionsMap[option]?.includes(selectedY)
    );
    setXOptions(filteredXOptions);
  };

  return (
    <div className="advanced-graph-container">
      <div className="graph-controls">
        <div>
          <label>X-axis:</label>
          <select
            value={xAxis}
            onChange={(e) => handleXChange(e.target.value)}
            className="axis-dropdown"
          >
            <option value="" disabled>
              Select X-axis
            </option>
            {xOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Y-axis:</label>
          <select
            value={yAxis}
            onChange={(e) => handleYChange(e.target.value)}
            className="axis-dropdown"
          >
            <option value="" disabled>
              Select Y-axis
            </option>
            {yOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="chart-container">
        <div className="card" style={{height:"500px"}}>
          <div className="card-body">
            {dataType === "splittedBarGraph" ? (
              <SplittedBarGraph dataList={chartData} xAxis={xAxis} />
            ) : (
              chartData && (
                <Graph
                  graphData={chartData}
                  xTitle={xAxis}
                  yTitle={yAxis}
                  color="#86E8D0"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedGraph;
