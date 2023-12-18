import React, { useEffect, useMemo, useState } from "react";
import CloseIcon from "../../assets/images/closeIcon.svg";
import ArrowUP from "../../assets/images/arrowUp.svg";
import DownArrow from "../../assets/images/arrowDown.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  newFilterData,
  tradeLogUpdateFilter,
} from "../../store/slice/tradeLogSlice";

const PopUpFilter = (props) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state);
  const token = reduxData?.auth?.token;
  // const [asset, setAsset] = useState(["Equity"]);
  // const [holding, setHolding] = useState(["positional"]);
  // const [conviction, setConviction] = useState("Low");
  // const [tradeAccount, setTradeAccount] = useState(["Strategy 1"]);
  // const [strategyUsed, setStrategyUsed] = useState(["Account A"]);

  const [allFiltersData, setAllFiltersData] = useState([]);

  useEffect(() => {
    reduxData.trades.filterData &&
      setAllFiltersData((prev) => reduxData.trades.filterData);
  }, [reduxData.trades.filterData]);

  const [rangeValue, setRangeValue] = useState(100);
  const closePopUp = () => {
    props.closePopUp();
  };
  const toggleFilterList = (index) => {
    setAllFiltersData((prev) => {
      const hold = prev.map((item, i) => {
        item.active = false;
        if (i == index) {
          item.active = !item.active;
        }
        return item;
      });
      return hold;
    });
  };
  const cutomSelection = (index, name) => {
    const hold = JSON.parse(JSON.stringify(reduxData.trades.filterData)).map(
      (item, i) => {
        if (i == index && item.selected) {
          if (item.selected.includes(name)) {
            if (item.selected.length != 1) {
              item.selected = item.selected.filter((each) => each != name);
            }
          } else {
            item.selected = [...item.selected, name];
          }
        }
        return item;
      }
    );
    setAllFiltersData((prev) => hold);
    dispatch(newFilterData(hold));
  };

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

  const sumitFilterData = () => {
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
    const startDate = currentStart || oldStart;
    const endDate = currentEnd || oldEnd;

    let makePayload = `?assetClass=${asset}&conviction=${conv}&strategyUsed=${strag}&minPnL=100&maxPnl=400&holdingTradeType=${holding}&tradingAccount=${tradeAcc}`;
    // let makePayload = `?assetClass=${asset}&conviction=${conv}&strategyUsed=${strag}&minPnL=100&maxPnl=400&holdingTradeType=${holding}&tradingAccount=${tradeAcc}&startDate=${startDate}&endDate=${endDate}`;
    dispatch(tradeLogUpdateFilter({ toke: token, values: makePayload }));
    closePopUp();
  };

  const dropdownList = useMemo(() => {
    return (
      <ul className="mainUl">
        {reduxData.trades.filterData.map((item, i) => {
          return (
            <li key={i} className="mainLi">
              {" "}
              <div className="mainLiUi">
                {item?.name}
                <span onClick={() => toggleFilterList(i)}>
                  <img style={{ cursor: "pointer"}} src={item.active ? ArrowUP : DownArrow} />
                </span>
              </div>
              {item.active && (
                <div className="mainLiBody">
                  <ul>
                    {item.data &&
                      item.data.map((each, x) => {
                        return (
                          <li key={x}>
                            <span
                              className={`popUpInput ${
                                item.selected.includes(each) && "active"
                              }`}
                              onClick={() => cutomSelection(i, each)}
                            ></span>
                            <span>{each}</span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
        <li className="submitBtn" onClick={sumitFilterData}>
          <div className="customSubmit">Submit</div>
        </li>
      </ul>
    );
  }, [allFiltersData, reduxData.trades.filterData]);

  return (
    <>
      <div className="popUpBg">
        <div className="filterPopUp">
          <div className="filterPopUpHeader">
            <p>Filter</p>
            <div className="closeFilter" onClick={closePopUp}>
              <img src={CloseIcon} />
            </div>
          </div>

          <div className="filterPopUBody">{dropdownList}</div>
        </div>
      </div>
    </>
  );
};

export default PopUpFilter;
