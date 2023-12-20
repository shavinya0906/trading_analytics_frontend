import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import { Button } from "react-bootstrap";
import arrowDown from "./../../assets/images/arrowDown.svg";
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

const FutureSimulator = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [stockData, setStockData] = useState([]);

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
        text: "Chart.js Bar Chart",
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

  useEffect(() => {
    generateRandomData(startDate, endDate);
  }, [startDate, endDate]);
  return (
    <>
      <div className="future-simulator-header">
        <div className="fs-date-selector">
          <div>
            <div className="customDateInput ">
              <select className="select-width ">
                <option>Select Year</option>
                <option value="3">1</option>
                <option value="2">3</option>
                <option value="1">5</option>
                <option value="1">10</option>
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
            />
          </div>
          <div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<ExampleCustomInput />}
              placeholderText="End Date"
            />
          </div>
        </div>
        <div>
          <Button
            variant="outline-primary"
            className="reset-button"
            onClick={resetDate}
          >
            Reset
          </Button>
        </div>
      </div>
      {startDate && endDate ? (
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
