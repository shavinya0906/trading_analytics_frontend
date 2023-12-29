import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import { Button } from "react-bootstrap";
import arrowDown from "./../../assets/images/arrowDown.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import NoData from "./../../assets/images/noData.svg";
import { tradeLogUpdateFilter } from "../../store/slice/tradeLogSlice";

const FutureSimulator = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [year, setYear] = useState();
  const [stockData, setStockData] = useState([]);
  const reduxData = useSelector((state) => state);
  const dispatch = useDispatch();
  const converter = (data) => {
    return data.join(",");
  };
  const asset = converter(reduxData.trades.filterData[0].selected);
  const conv = converter(reduxData.trades.filterData[2].selected);
  const holding = converter(reduxData.trades.filterData[1].selected);
  const tradeAcc = converter(reduxData.trades.filterData[3].selected);
  const strag = converter(reduxData.trades.filterData[4].selected);

  const ExampleCustomInput = forwardRef(
    ({ value, onClick, placeholder }, ref) => (
      <button className="customDateInput" onClick={onClick} ref={ref}>
        {value ? value : placeholder}
        <span className="arrow-icon">
          <img src={arrowDown} alt="arrow-down" />
        </span>
      </button>
    )
  );
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
    // scales: {
    //   x: {
    //     type: 'time',
    //     time: {
    //       unit: 'day',
    //     },
    //   },
    //   y: {
    //     beginAtZero: true,
    //   },
    // },
  };
  const chartData = {
    labels: stockData.map((entry) => entry.date),
    datasets: [
      {
        label: "Stock Price",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        data: stockData.map((entry) => entry.price),
      },
    ],
  };
  const generateRandomData = () => {
    const data = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const stockPrice = faker.finance.amount();
      data.push({
        date: currentDate.toISOString().split("T")[0],
        price: parseFloat(stockPrice),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setStockData(data);
  };

  const resetDate = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const isOneMonthGap = () => {
    // Assuming startDate and endDate are Date objects
    if (startDate && endDate) {
      const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000; // Assuming 30 days in a month
      const timeDifference = endDate.getTime() - startDate.getTime();
      return timeDifference >= oneMonthInMillis;
    }
  };

  const formatDate = (date) => {
    // Use toISOString to get a standardized date string and extract yyyy-mm-dd
    return date.toISOString().split("T")[0];
  };

  function findNearestBoundaryTrade(trades, startDate, endDate) {
    let startingTrade = null;
    let endingTrade = null;
    let minDistance = Infinity;
    let minDistance1 = Infinity;
    for (let i = 0; i < trades.length; i++) {
      const trade = trades[i];
      const distance = Math.abs(
        new Date(trade.trade_date).getTime() - startDate.getTime()
      );
      const distance1 = Math.abs(
        new Date(trade.trade_date).getTime() - endDate.getTime()
      );
      if (distance < minDistance) {
        minDistance = distance;
        startingTrade = trade;
      }
      if (distance1 < minDistance1) {
        minDistance1 = distance1;
        endingTrade = trade;
      }
    }
    return [startingTrade, endingTrade];
  }

  const calculateRate = () => {
    let [beginningTrade, endingTrade] = findNearestBoundaryTrade(
      reduxData.trades?.data,
      startDate,
      endDate
    );
    let months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    let CAGR = Math.pow(
      (endingTrade.opening_balance + endingTrade.trade_pnl) /
        beginningTrade.opening_balance,
      1 / (months / 12)
    );
    if (CAGR > 1) CAGR -= 1;
    return CAGR;
  };

  const calculateFutureValue = () => {
    let futureValue = 0;
    let investment = 0;
    let rate = calculateRate();
    let time = year;
    let [startingTrade] = findNearestBoundaryTrade(
      reduxData.trades?.data,
      startDate,
      endDate
    );

    if (startingTrade) {
      investment = startingTrade.opening_balance;
    }
    futureValue = investment * Math.pow(1 + rate, time);
    console.log(futureValue);
  };

  const extractTrades = () => {
    let makePayload = `?assetClass=${asset}&conviction=${conv}&strategyUsed=${strag}&minPnL=100&maxPnl=400&holdingTradeType=${holding}&tradingAccount=${tradeAcc}&startDate=${formatDate(
      startDate
    )}&endDate=${formatDate(endDate)}`;
    dispatch(
      tradeLogUpdateFilter({ toke: reduxData.auth.token, values: makePayload })
    );
  };

  useEffect(() => {
    setStockData([]);
    if (isOneMonthGap()) {
      extractTrades();
    }
  }, [startDate, endDate, year]);

  const onProject = () => {
    if (isOneMonthGap()) {
      generateRandomData();
      calculateFutureValue();
    }
  };

  return (
    <>
      <div className="future-simulator-header">
        <div className="fs-date-selector">
          <div>
            <div className="customDateInput ">
              <select
                className="select-width "
                onChange={(e) => {
                  setYear(e.target.value);
                }}
              >
                <option>Select Year</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
          <div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<ExampleCustomInput />}
              placeholderText="Start Date"
              maxDate={new Date()}
            />
          </div>
          <div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<ExampleCustomInput />}
              placeholderText="End Date"
              maxDate={new Date()}
            />
          </div>
        </div>
        <div>
          <Button
            variant="primary"
            className="reset-button"
            onClick={onProject}
          >
            Project
          </Button>
          <Button
            variant="outline-primary"
            className="reset-button"
            onClick={resetDate}
          >
            Reset
          </Button>
        </div>
      </div>
      {stockData.length > 0 && isOneMonthGap() ? (
        <div className="graph-container">
          <h2>Future Simulator</h2>
          <div>
            <Line options={options} data={chartData} height={"100%"} />
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={NoData} alt="NodataImage" height="366.6px" width="492px" />
          <div style={{ width: "583px", height: "82px" }}>
            <p
              style={{
                textAlign: "center",
                fontSize: "26px",
                lineHeight: "41px",
                fontWeight: "500",
              }}
            >
              To use this feature, just make sure you have at least one month of
              data.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FutureSimulator;
