import React, { forwardRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Button, Nav, Dropdown } from "react-bootstrap";
import "./header.scss";
import PlusIcon from "../../assets/images/plus.svg";
import clockIcon from "../../assets/images/clock.svg";
import ReactDatePicker from "react-datepicker";
import calander from "../../assets/images/calander.svg";
import handMoney from "../../assets/images/Hand Money.svg";
import profileImg from "../../assets/images/profile-img.png";
import MoonIcon from "../../assets/images/moon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  calenderEnd,
  calenderStart,
  tradeLogUpdateFilter,
} from "../../store/slice/tradeLogSlice";
import { dashboardUpdateData } from "../../store/slice/homeSlice";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };
  const reduxData = useSelector((state) => state);
  const excludeLeftWrap = [
    {
      route: "/strategies",
      title: "Strategy",
    },
    {
      route: "/trading-accounts",
      title: "Trading Accounts",
    },
  ];
  const location = useLocation();
  const token = reduxData?.auth?.token;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
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

  const asset = converter(reduxData.trades.filterData[0].selected);
  const conv = converter(reduxData.trades.filterData[2].selected);
  const holding = converter(reduxData.trades.filterData[1].selected);
  const tradeAcc = converter(reduxData.trades.filterData[3].selected);
  const strag = converter(reduxData.trades.filterData[4].selected);

  const monthRange = currentMonthRange(new Date());
  const oldStart = monthRange.starting.toISOString().substring(0, 10);
  const oldEnd = monthRange.ending.toISOString().substring(0, 10);

  const currentStart =
    reduxData.trades?.start && currentMonthRangeNew(reduxData.trades?.start);
  const currentEnd =
    reduxData.trades?.end && currentMonthRangeNew(reduxData.trades?.end);

  const sumitFilterData = () => {
    const startDate = currentStart || oldStart;
    const endDate = currentEnd || oldEnd;

    let makePayload = `?assetClass=${asset}&conviction=${conv}&strategyUsed=${strag}&minPnL=100&maxPnl=400&holdingTradeType=${holding}&tradingAccount=${tradeAcc}&startDate=${startDate}&endDate=${endDate}`;
    let dashboardPayloadUrl = `?startDate=${startDate}&endDate=${endDate}`;
    dispatch(tradeLogUpdateFilter({ toke: token, values: makePayload }));
    dispatch(
      dashboardUpdateData({ token: token, values: dashboardPayloadUrl })
    );
  };

  useEffect(() => {
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf("/") + 1);
    if (filename == "tradelog" || filename == "dashboard") {
      endDate && sumitFilterData();
    } else if (filename == "trader-analytics") {
      const startDate = currentStart || oldStart;
      const endDate = currentEnd || oldEnd;
    }
  }, [endDate]);

  const onChange = (dates) => {
    const [start, end] = dates;
    dispatch(calenderStart(start));
    dispatch(calenderEnd(end));

    setStartDate(start);
    setEndDate(end);
  };
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="DateInput" onClick={onClick} ref={ref}>
      {value}
      <span className="clock-icon">
        <img src={clockIcon} alt="clock" />
      </span>
    </button>
  ));
  return (
    <div className="header-wrapper">
      <div className="header-left-wrap">
        {excludeLeftWrap.map((el) => el.route).includes(location.pathname) ? (
          <p className="header-title">
            {excludeLeftWrap.find((el) => el.route === location.pathname).title}
          </p>
        ) : (
          <>
            <Link to={"/tradelog"}>
              <button className="new-trade-btn">
                New Trade
                <img src={PlusIcon} alt="plus" className="plus-icon" />
              </button>
            </Link>

            <ReactDatePicker
              selected={startDate}
              onChange={onChange}
              customInput={<ExampleCustomInput />}
              startDate={startDate}
              endDate={endDate}
              selectsRange
            />
            <div
              className="flex h-[49px] justify-center items-center text-2xl cursor-pointer cross-icon"
              onClick={() => onChange([null, null])}
            >
              X
            </div>
            <Link to={"/calendar"} style={{ textDecoration: "none" }}>
              <Button variant="outline-primary" className="outline-button-cal">
                Calendar
                <img src={calander} alt="plus" className="plus-icon" />
              </Button>
            </Link>
            <Button variant="outline-primary" className="outline-button-man">
              Mantra
              <img src={handMoney} alt="plus" className="plus-icon" />
            </Button>
          </>
        )}
      </div>
      <div className="profile-wrapper">
        <img src={MoonIcon} alt="" className="moonIcon-wrap" />
        <div>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="profile-dropdown">
              <img src={profileImg} alt="" className="profileImg" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#" onClick={logout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* <h3 className="profile-name">Bessie Cooper</h3> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
