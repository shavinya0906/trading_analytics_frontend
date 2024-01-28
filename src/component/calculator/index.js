import React, { useEffect, useState } from "react";
import "./calculator.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCurrentTab,
  loadingStatus,
} from "../../store/slice/calculatorSlice";
import ProfitAndLoss from "./calculators/profitAndLoss";
import PositionSize from "./calculators/positionSize";
import RiskReward from "./calculators/riskReward";
import StockAverage from "./calculators/stockAverage";
import { Route, Routes, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Calculator = () => {
  const navigate=useNavigate();
  const reduxData = useSelector((state) => state);
  const [data, setMainData] = useState([]);
  const [path, setPath] = useState("tools/profit-and-loss");
  const dispatch = useDispatch();
  const [calculatorHeaders, setcalculatorHeaders] = useState([
    { name: "Profit & Loss", active: true, path: "calculator/profit-and-loss" },
    { name: "Position Size", active: false, path: "calculator/position-size" },
    {
      name: "Risk : Reward",
      active: false,
      path: "calculator/risk-reward",
    },
    {
      name: "Stock Average",
      active: false,
      path: "calculator/stock-average",
    },
  ]);
  const [calculatorHeadersCurrent, setcalculatorHeadersCurrent] =
    useState("Profit & Loss");

  useEffect(() => {
    if (
      reduxData.calculator.data &&
      reduxData.calculator.currentTab == "Profit & Loss"
    ) {
      const data = reduxData.calculator.data;
      const blankArr = [];
      for (const [key, value] of Object.entries(data)) {
        blankArr.push({ name: key, value: value ? value.toFixed(2) : value });
      }
      setMainData((prev) => blankArr);
    }
  }, [reduxData.calculator.data]);

  const currentHeader = (position) => {
    dispatch(addCurrentTab(calculatorHeaders[position].name));
    setcalculatorHeadersCurrent((prev) => calculatorHeaders[position].name);
    navigate(`/${calculatorHeaders[position].path}`);
    setPath((prev) => calculatorHeaders[position].path);
    setcalculatorHeaders((prev) => {
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

  return (
    <>
      {
        <div className="calculator">
          <div className="calculatorHeader">
            <ul className="calculatorHeaderList">
              {calculatorHeaders.length &&
                calculatorHeaders.map((item, i) => {
                  return (
                    <li key={i}>
                      <div
                        className={item.active ? "active" : undefined}
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
          <div className="calculatorBody">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/calculator/profit-and-loss" />}
              />
              <Route
                path="/profit-and-loss"
                element={
                  <>
                    <ProfitAndLoss />
                  </>
                }
              />
              <Route
                path="/position-size"
                element={
                  <>
                    <PositionSize />
                  </>
                }
              />
              <Route
                path="/risk-reward"
                element={
                  <>
                    <RiskReward />
                  </>
                }
              />
              <Route
                path="/stock-average"
                element={
                  <>
                    <StockAverage />
                  </>
                }
              />
            </Routes>
          </div>
        </div>
      }
    </>
  );
};

export default Calculator;
