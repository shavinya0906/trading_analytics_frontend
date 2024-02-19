import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  tradeLogAdd,
  tradeLogEdit,
  tradeLogList,
  tradeLogUpdateFilter,
} from "../../store/slice/tradeLogSlice";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Table from "react-bootstrap/Table";
import "./tradelog.scss";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import {
  getColumnData,
  updateColumnData,
  createColumnData,
  deleteColumnData,
} from "../../store/slice/newColumnSlice";
import EditIcon from "../../assets/images/editFilter.svg";
import FilterIcon from "../../assets/images/filterIcon.svg";
import ExportIcon from "../../assets/images/export.svg";
import PopUpFilter from "../home/PopUpFilter";
import OutsideClick from "../home/OutsideClick";
import ArrowUP from "../../assets/images/arrowUp.svg";
import DownArrow from "../../assets/images/arrowDown.svg";
import { strategyList } from "../../store/slice/strategySlice";
import { tradingAccountList } from "../../store/slice/tradingAccountsSlice";
import { CSVLink } from "react-csv";
import NoTradeData from "./../../assets/images/noTradeLogData.svg";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";
import DailyQuestionnaire from "./DailyQuestionnaire";
import { getTradeById, updateTrade } from "../../store/slice/tradeLogSlice";
import Loader from "./../Loader";

const tableHeading = [
  "Date",
  "Asset class",
  "Position",
  "Buy/Sell",
  "Position Size",
  "Stop Loss",
  "Target",
  "PnL",
  "Points Captured",
  "Net ROI",
  "Strategy",
  "Holding Trade",
  "Conviction",
  "Risk : Reward",
  "Reason for Trade",
  "Karma",
  "Comment",
  "% of account risked",
  "Charges",
  "Slippage",
  "Penalties",
  "Trading account",
  "Opening Balance",
  "Image",
];

const tableHeadingObj = {
  Date: { label: "trade_date", type: "string" },
  "Asset class": { label: "asset_class", type: "string" },
  Position: { label: "position", type: "string" },
  "Buy/Sell": { label: "buy_sell", type: "string" },
  "Position Size": { label: "position_size", type: "number" },
  "Stop Loss": { label: "stop_loss", type: "number" },
  Target: { label: "trade_target", type: "number" },
  PnL: { label: "trade_pnl", type: "number" },
  "Points Captured": { label: "points_captured", type: "number" },
  "Net ROI": { label: "net_roi", type: "number" },
  Strategy: { label: "strategy_used", type: "string" },
  "Holding Trade": { label: "holding_trade_type", type: "string" },
  Conviction: { label: "trade_conviction", type: "string" },
  "Risk  : Reward": { label: "trade_risk", type: "string" },
  "Reason for Trade": { label: "reason_for_trade", type: "string" },
  Karma: { label: "trade_karma", type: "string" },
  Comment: { label: "comment", type: "string" },
  "% of account risked": {
    label: "percentage_of_account_risked",
    type: "number",
  },
  Charges: { label: "trade_charges", type: "number" },
  Slippage: { label: "trade_slippage", type: "number" },
  Penalties: { label: "trade_penalties", type: "number" },
  "Trading account": { label: "trading_account", type: "string" },
  "Opening Balance": { label: "opening_balance", type: "number" },
  Image: { label: "image", type: "string" },
  // "Trade Customizable": { label: "trade_customizable", type: "string" },
  // "Daily questionnaire": { label: "comment", type: "string" },
};

function TradeLog() {
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const formikRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const token = useSelector((state) => state?.auth?.token);
  const reduxData = useSelector((state) => state?.trades?.data);
  const isLoading=useSelector((state)=>state?.trades?.isLoading)
  const { start, end } = useSelector((state) => state?.trades);
  useEffect(() => {
    if (end) {
      setTradeList(
        () =>
          reduxData.length > 0 &&
          reduxData?.filter(
            (el) =>
              new Date(start) < new Date(el?.trade_date) &&
              new Date(end) > new Date(el?.trade_date)
          )
      );
    } else {
      setTradeList((prev) => reduxData.data);
    }
  }, [end, reduxData]);
  async function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  const [tradeList, setTradeList] = useState([]);

  useEffect(() => {
    if (reduxData?.data?.length) {
      setTradeList((prev) => reduxData.data);
    }
  }, [reduxData]);

  const isAddedOrEdited = useSelector(
    (state) => state?.trades?.isAddedOrEdited
  );
  const columnDetail = useSelector((state) => state?.columnList?.data);
  const [strategies, setStrategies] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const strategyData = useSelector((state) => state?.strategy?.data);
  const tradingAccounts = useSelector((state) => state?.tradingAccounts?.data);
  const [edit, setEdit] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [startDate1, setStartDate1] = useState(new Date());
  const [id, setId] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [changes, setChanges] = useState(false);
  const [allIds, setAllIds] = useState([]);
  const { starttDate, enddDate } = useParams();
  useEffect(() => {
    if (strategyData?.length) {
      setStrategies((prev) => strategyData);
    }
  }, [strategyData]);

  useEffect(() => {
    if (tradingAccounts?.length) {
      setAccountList((prev) => tradingAccounts);
    }
  }, [tradingAccounts]);

  const [pageDetail, setPageDetail] = useState({
    page: 1,
    pageSize: 10,
    enableNext: false,
    enablePrevious: false,
  });

  useEffect(() => {
    if (starttDate && enddDate) {
      let payloadUrl = `?startDate=${starttDate}&endDate=${enddDate}&pageSize=${pageDetail.pageSize}&page=${pageDetail.page}`;
      dispatch(tradeLogUpdateFilter({ token: token, values: payloadUrl }));
    } else {
      let payloadUrl = `&pageSize=${pageDetail.pageSize}&page=${pageDetail.page}`;
      // dispatch(tradeLogUpdateFilter({ token: token, values: payloadUrl }));
      dispatch(tradeLogList({ token: token, payloadUrl: payloadUrl }));
    }
    dispatch(strategyList(token));
    dispatch(tradingAccountList(token));
  }, [isAddedOrEdited === true, starttDate && enddDate]);

  useEffect(() => {
    dispatch(getColumnData(token));
  }, []);

  const tradeSchema = Yup.object().shape({
    asset_class: Yup.string(),
    position_size: Yup.string().required("Required"),
    points_captured: Yup.number(),
    trade_pnl: Yup.number().required("Required"),
    position: Yup.string().required("Required"),
    buy_sell: Yup.string().required("Required"),
    // trade_remark: Yup.string().required("Required"),
    trade_karma: Yup.string(),
    trade_date: Yup.string().required("Required"),
    holding_trade_type: Yup.string(),
    trade_charges: Yup.number().required("Required"),
    trading_account: Yup.string(),
    stop_loss: Yup.string(),
    // trade_target: Yup.string(),
    trade_conviction: Yup.string(),
    strategy_used: Yup.string(),
    trade_risk: Yup.string(),
    reason_for_trade: Yup.string(),
    percentage_of_account_risked: Yup.number(),
    trade_slippage: Yup.number(),
    trade_penalties: Yup.number().required("Required"),
    net_roi: Yup.number(),
    trade_customizable: Yup.string(),
    opening_balance: Yup.number().when("trade_date", {
      is: (tradeDate) => {
        return tradeList.length === 0;
      },
      then: Yup.number().required("Required"),
      otherwise: Yup.number().transform((value, originalObject) => {
        if (!value) {
          return calculateOpeningBalance(originalObject);
        }
        return value;
      }),
    }),
    comment: Yup.string(),
  });
  function calculateOpeningBalance(originalObject) {
    //Opening balance = prev opening balance +pnl - charges - penalties
    const pnl = originalObject?.trade_pnl;
    const charges = originalObject?.trade_charges;
    const penalties = originalObject?.trade_penalties;
    let newOpeningBalance = reduxData.lastAddedTradeOpeningBalance;
    if (pnl) {
      newOpeningBalance += pnl;
    }
    if (charges) {
      newOpeningBalance -= charges;
    }
    if (penalties) {
      newOpeningBalance -= penalties;
    }
    const calculatedBalance = newOpeningBalance;
    return calculatedBalance;
  }

  function filterEmptyValues(obj) {
    const filteredObject = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== "") {
        filteredObject[key] = obj[key];
      }
    }

    return filteredObject;
  }

  const handleAddSubmit = async (values, { resetForm }) => {
    console.log(values);
    for (const obj of columnDetail) {
      // dispatch(createColumnData({token:token,data:obj.column_name}));
      const newObject = {
        key: obj.id,
        value: values[obj.column_name] || "",
      };
      values.dynamicColumn = [...values.dynamicColumn, newObject];
      delete values[obj.column_name];
    }
    delete values.dynamicColumnsField;
    values.trade_date = moment(values?.trade_date).format("yyyy-MM-DD");
    let payload = {
      token: token,
      values: filterEmptyValues(values),
      // values: { ...values, image: imageBase },
    };
    if (image) {
      const imageBase = await getBase64(image);
      payload = {
        ...payload,
        values: {
          ...payload.values,
          image: imageBase,
        },
      };
    }

    setTradeList((prev) => [payload.values, ...prev]);
    dispatch(tradeLogAdd(payload));
    resetForm();
  };

  const handleEditSubmit = () => {
    const customId = [...new Set(allIds)];
    const holdTrade = tradeList.map((item) => {
      const tradeCopy = { ...item };
      delete tradeCopy.createdAt;
      delete tradeCopy.user_id;
      delete tradeCopy.id;
      return {
        id: item.id,
        data: tradeCopy,
      };
    });
    const allVal = holdTrade.filter((item, i) => customId.includes(i));
    const payload = {
      token: token,
      values: allVal,
    };
    dispatch(tradeLogEdit(payload));
    setId("");
    setEdit(false);
  };

  // const handleEditSubmitSingleTrade = async (values) => {
  //   try {
  //     const payload = {
  //       questionnaireId: id,
  //       answers: values,
  //       token: token,
  //     };
  //     const response = await dispatch(updateTrade(payload));
  //     console.log("Trade updated successfully:", response);
  //   } catch (error) {
  //     console.error("Error updating trade:", error);
  //   } finally {
  //     setId("");
  //   }
  // };

  const handlesSubmit = () => {
    if (formikRef?.current) {
      // handleEditSubmitSingleTrade(formikRef?.current?.values);
    }
  };

  function matchAndMapColumns(columnData, dynamicColumnData) {
    const result = [];
    for (const columnItem of columnData) {
      const matchingDynamicColumn = dynamicColumnData.find(
        (dynamicColumnItem) => dynamicColumnItem.key === columnItem.id
      );

      // If there is a match, add to the result
      if (matchingDynamicColumn) {
        result.push({
          name: columnItem.column_name,
          value: matchingDynamicColumn.value,
        });
      } else {
        // If no match, add an entry with an empty value
        result.push({
          name: columnItem.column_name,
          value: "",
        });
      }
    }

    console.log(result);

    return result;
  }

  const closePopUp = () => {
    setPopUp((prev) => false);
  };

  const togglePopUp = () => {
    setPopUp((prev) => true);
  };
  const externalVal = (field, val, forProp) => {
    forProp.setFieldValue(field, val);
  };
  const modifyExistingData = (field, id, value) => {
    setAllIds((prev) => [...prev, id]);
    setTradeList((prev) => {
      const hold = JSON.parse(JSON.stringify(prev)).map((item, i) => {
        if (i === id) {
          if (typeof item[field] === "number") {
            item[field] = parseFloat(value);
          } else {
            item[field] = value;
          }
        }
        return item;
      });

      return hold;
    });
    setChanges((prev) => !prev);
  };

  const modifyExistingDynamicColumnData=(field,id,value)=>{
    setAllIds((prev) => [...prev, id]);
    console.log(field,id,value,"idadajdkajkaksmm")
    setTradeList((prev) => {
      const hold = JSON.parse(JSON.stringify(prev)).map((item, i) => {
        if (i === id) {
          item.dynamicColumn = item.dynamicColumn.map((dynamicColumnItem) => {
            if (dynamicColumnItem.key === field) {
              dynamicColumnItem.value = value;
            }
            return dynamicColumnItem;
          });
        }
        return item;
      });

      return hold;
    });
    setChanges((prev) => !prev);
  }

  const ref = useRef();
  OutsideClick(ref, closePopUp);

  const [holdPl, setHoldPl] = useState(null);
  const [sort, setSort] = useState({
    label: "",
    sort: "ASC",
  });

  const sortDataBy = (data, byKey) => {
    let sortedData;
    const arrayForSort = [...data];
    if (sort?.sort === "ASC") {
      if (byKey.type == "string") {
        sortedData = arrayForSort.sort((a, b) => {
          let x = a[byKey.label]?.toLowerCase();
          let y = b[byKey.label]?.toLowerCase();
          if (x > y) {
            return 1;
          }
          if (x < y) {
            return -1;
          }
          return 0;
        });
      } else {
        sortedData = arrayForSort.sort((a, b) => {
          return a[byKey.label] - b[byKey.label];
        });
      }
    } else {
      if (byKey.type == "string") {
        sortedData = arrayForSort.sort((a, b) => {
          let x = a[byKey.label]?.toLowerCase();
          let y = b[byKey.label]?.toLowerCase();
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        });
      } else {
        sortedData = arrayForSort.reverse((a, b) => {
          return a[byKey.label] - b[byKey.label];
        });
      }
    }
    setTradeList(sortedData);
  };

  const [searchText, setSearchText] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    setTradeList(() =>
      reduxData?.data?.filter((trade) => {
        return (
          (trade.trade_remark &&
            trade.trade_remark.toLowerCase().includes(searchText)) ||
          (trade.asset_class &&
            trade.asset_class.toLowerCase().includes(searchText)) ||
          (trade.holding_trade_type &&
            trade.holding_trade_type.toLowerCase().includes(searchText)) ||
          (trade.strategy_used &&
            trade.strategy_used.toLowerCase().includes(searchText)) ||
          (trade.trade_tags &&
            trade.trade_tags.toLowerCase().includes(searchText)) ||
          (trade.reason_for_trade &&
            trade.reason_for_trade.toLowerCase().includes(searchText)) ||
          (trade.buy_sell &&
            trade.buy_sell.toLowerCase().includes(searchText)) ||
          (trade.comment && trade.comment.toLowerCase().includes(searchText)) ||
          (trade.trading_account &&
            trade.trading_account.toLowerCase().includes(searchText)) ||
          (trade.position && trade.position.toLowerCase().includes(searchText))
        );
      })
    );
  }, [searchText]);

  const handleNext = () => {
    if (pageDetail.page < reduxData?.totalRecords / 10) {
      setPageDetail((prev) => {
        return {
          ...prev,
          page: prev.page + 1,
        };
      });
      let payloadUrl = `&pageSize=${pageDetail.pageSize}&page=${
        pageDetail.page + 1
      }`;
      dispatch(tradeLogList({ token: token, payloadUrl: payloadUrl }));
    }
  };

  const handlePrevious = () => {
    //handling function according to reduxData.totalRecords
    if (pageDetail.page > 0) {
      setPageDetail((prev) => ({ ...prev, page: prev.page - 1 }));
      let payloadUrl = `&pageSize=${pageDetail.pageSize}&page=${
        pageDetail.page - 1
      }`;
      dispatch(tradeLogList({ token: token, payloadUrl: payloadUrl }));
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= reduxData?.totalRecords / 10) {
      setPageDetail((prev) => ({ ...prev, page: pageNumber }));
      let payloadUrl = `&pageSize=${pageDetail.pageSize}&page=${pageNumber}`;
      dispatch(tradeLogList({ token: token, payloadUrl: payloadUrl }));
    }
  };

  const [questionnaireModal, setShowQuesitonireModal] = useState(false);
  const [questionnaireId, setQuestionnaireId] = useState("");
  const onCloseQuestionnaire = () => {
    setShowQuesitonireModal(false);
    setQuestionnaireId("");
  };

  const onOpenQuestionnaire = (id) => {
    setQuestionnaireId(id);
    setShowQuesitonireModal(true);
    dispatch(getTradeById({ id, token }));
  };

  const deleteColumn=(column_id)=>{
    dispatch(deleteColumnData({token:token,id:column_id}))
  }

  return (
    <>
      {questionnaireModal && questionnaireId && (
        <DailyQuestionnaire
          closePopUp={onCloseQuestionnaire}
          questionnaireId={questionnaireId}
        />
      )}
      {tradeList && tradeList.length > 0 &&!isLoading ? (
        <div className="main-content demo-b">
          {popUp && (
            <div ref={ref}>
              <PopUpFilter
                closePopUp={closePopUp}
                setTradeList={setTradeList}
              />
            </div>
          )}
          <div className="customFilterButton">
            {edit ? (
              <>
                {" "}
                <ul>
                  <li
                    onClick={() => {
                      setEdit(false);
                    }}
                  >
                    Cancel
                  </li>
                  <li
                    onClick={() => {
                      handleEditSubmit();
                    }}
                  >
                    Save
                  </li>
                </ul>
              </>
            ) : (
              <>
                <div className="textbox">
                  <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchInputChange}
                    placeholder="Search..."
                    style={{
                      width: "30%",
                      resize: "none",
                      padding: "10px",
                      border: "1px solid rgb(201, 201, 201)",
                      borderRadius: "12px",
                      height: "40px",
                      textAlign: "center",
                      // marginLeft:"20px"
                    }}
                  />
                  <ul>
                    <li
                      onClick={() => {
                        setEdit(true);
                      }}
                    >
                      Edit
                      <span>
                        <img src={EditIcon} alt="edit filter" height={18} width={18}/>
                      </span>
                    </li>
                    <li className="export-data">
                      <CSVLink
                        data={tradeList.map((el) => ({
                          ...el,
                          trade_date: new Date(el.trade_date).toDateString(),
                          // trade_date: "ss"
                        }))}
                        headers={Object.keys(tableHeadingObj).map((heading) => {
                          return {
                            key: tableHeadingObj[heading].label,
                            label: heading?.toLowerCase().replace(/\s+/g, "_"),
                          };
                        })}
                        filename={"tradelog-exports.csv"}
                      >
                        Export
                        <img src={ExportIcon} alt="main filter" />
                      </CSVLink>
                    </li>
                    <li onClick={togglePopUp}>
                      Filters{" "}
                      <span>
                        <img src={FilterIcon} alt="main filter" />
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
          <div className="tradelog-tbl">
            <div className="table_wrapper">
              <div className="table-responsive">
                <Table cellSpacing="0" cellPadding="0">
                  <thead>
                    <tr>
                      {tableHeading.map((header, index) => (
                        <th key={header}>
                          {header}
                          <span
                            className="sort-arrow"
                            onClick={() =>
                              setSort((prev) => {
                                if (
                                  prev?.label === "" ||
                                  prev?.label !== header
                                ) {
                                  setSort((prev) => ({
                                    ...prev,
                                    label: header,
                                    sort: "ASC",
                                  }));
                                  sortDataBy(
                                    tradeList,
                                    tableHeadingObj[header]
                                  );
                                } else if (
                                  prev?.label === header &&
                                  prev?.label === "ASC"
                                ) {
                                  setSort((prev) => ({
                                    ...prev,
                                    label: header,
                                    sort: "DESC",
                                  }));
                                  sortDataBy(
                                    tradeList,
                                    tableHeadingObj[header]
                                  );
                                } else if (
                                  prev?.label === header &&
                                  prev?.label === "DESC"
                                ) {
                                  setSort((prev) => ({
                                    ...prev,
                                    label: header,
                                    sort: "ASC",
                                  }));
                                  sortDataBy(
                                    tradeList,
                                    tableHeadingObj[header]
                                  );
                                }
                              })
                            }
                          >
                            <img
                              style={{ cursor: "pointer" }}
                              src={
                                sort?.label === header
                                  ? sort?.sort === "ASC"
                                    ? ArrowUP
                                    : DownArrow
                                  : DownArrow
                              }
                            />
                          </span>
                        </th>
                      ))}
                      {columnDetail?.length > 0 &&
                        columnDetail?.map((header, index) => (
                          <th key={index}>{header?.column_name}<button onClick={()=>{deleteColumn(header?.id)}}>Delete</button></th>
                        ))}
                      {/* {dynamicColumns.map((customHeader, index) => (
                        <th key={index}>{customHeader}</th>
                      ))} */}
                      <th key={"addColumn"}>Dynamic Column</th>
                      <th>Daily Questionnaire</th>
                      <th key={"heads"}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Formik
                      initialValues={{
                        asset_class: "",
                        position_size: "",
                        points_captured: "",
                        trade_pnl: "",
                        position: "",
                        buy_sell: "",
                        trade_remark: "",
                        trade_karma: "",
                        trade_date: "",
                        holding_trade_type: "",
                        trade_charges: "",
                        trading_account: "",
                        stop_loss: "",
                        trade_target: "",
                        trade_conviction: "",
                        strategy_used: "",
                        trade_risk: "",
                        reason_for_trade: "",
                        percentage_of_account_risked: "",
                        image: "",
                        trade_slippage: "",
                        trade_penalties: "",
                        net_roi: "",
                        trade_customizable: "",
                        opening_balance: "",
                        trade_tags: "",
                        comment: "",
                        dynamicColumnsField: "",
                        ...columnDetail?.reduce((acc, item) => {
                          return {
                            ...acc,
                            [item.column_name]: "",
                          };
                        }, {}),
                        dynamicColumn: [],
                      }}
                      validationSchema={tradeSchema}
                      onSubmit={handleAddSubmit}
                    >
                      {({
                        values,
                        setFieldValue,
                        isSubmitting,
                        handleSubmit,
                      }) =>
                        !edit && (
                          <tr key={"first"} className="first">
                            <td>
                              <ReactDatePicker
                                id="trade_date"
                                name="trade_date"
                                closeOnScroll={true}
                                selected={startDate}
                                onChange={(date) => {
                                  setStartDate(date);
                                  setFieldValue("trade_date", date); // Update the formik value
                                }}
                                dateFormat="yyyy-MM-dd"
                              />
                              <ErrorMessage name="trade_date" component="div" />
                            </td>
                            <td>
                              <Field as="select" name="asset_class">
                                <option>Select</option>
                                <option value="Equity">Equity</option>
                                <option value="Features">Features</option>
                                <option value="Options">Options</option>
                                <option value="Currency">Currency</option>
                                <option value="Commodity">Commodity</option>
                                <option value="Crypto">Crypto</option>
                              </Field>
                              <ErrorMessage
                                name="asset_class"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="text" name="position" />
                              <ErrorMessage name="position" component="div" />
                            </td>
                            <td>
                              <Field as="select" name="buy_sell">
                                <option>Select</option>
                                <option value="Buy">Buy</option>
                                <option value="Sell">Sell</option>
                              </Field>
                              <ErrorMessage name="buy_sell" component="div" />
                            </td>
                            <td>
                              <Field type="number" name="position_size" />
                              <ErrorMessage
                                name="position_size"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="number" name="stop_loss" />
                              <ErrorMessage name="stop_loss" component="div" />
                            </td>
                            <td>
                              <Field type="number" name="trade_target" />
                              <ErrorMessage
                                name="trade_target"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field
                                type="number"
                                name="trade_pnl"
                                // onChange={(e) => {
                                //   console.log("value", e.target.value);

                                //   const value = e.target.valueAsNumber;

                                //   // setHoldPl((prev) => value);
                                //   // if (!value) {
                                //   //   return;
                                //   // }
                                // }}
                                // value={holdPl}
                              />
                              <ErrorMessage name="trade_pnl" component="div" />
                            </td>
                            <td>
                              <Field type="number" name="points_captured" />
                              <ErrorMessage
                                name="points_captured"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="number" name="net_roi" />
                              <ErrorMessage name="net_roi" component="div" />
                            </td>
                            <td>
                              <Field as="select" name="strategy_used">
                                <option>Select</option>
                                {strategies?.length > 0 &&
                                  strategies.map((el, index) => (
                                    <option key={index}>
                                      {el.strategies_name}
                                    </option>
                                  ))}
                                {/* <option value="Strategy 1">Strategy 1</option>
                            <option value="Strategy 2">Strategy 2</option> */}
                              </Field>
                              <ErrorMessage
                                name="strategy_used"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field as="select" name="holding_trade_type">
                                <option>Select</option>
                                <option value="Positional">Positional</option>
                                <option value="Intraday">Intraday</option>
                                <option value="Swing">Swing</option>
                                <option value="Short Term">Short Term</option>
                                <option value="Long Term">Long Term</option>
                                <option value="Expiry">Expiry</option>
                                <option value="BTST">BTST</option>
                              </Field>
                              <ErrorMessage
                                name="holding_trade_type"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field as="select" name="trade_conviction">
                                <option>Select</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </Field>
                              <ErrorMessage
                                name="trade_conviction"
                                component="div"
                              />
                            </td>
                            {/* <td>
                          <Field type="text" name="trade_risk" />
                          <ErrorMessage name="trade_risk" component="div" />
                        </td> */}
                            <td>
                              <input
                                className="w-[50%]"
                                type="number"
                                onChange={(e) => {
                                  setFieldValue(
                                    "trade_risk",
                                    `${e.target.value}:${
                                      values?.trade_risk
                                        ?.replace(/ /g, "")
                                        .split(/:/g)[1] || 1
                                    }`
                                  );
                                }}
                                value={
                                  values?.trade_risk
                                    ?.replace(/ /g, "")
                                    .split(/:/g)[0] || 1
                                }
                              />
                              <span className="font-bold, mx-2 text-center text-2xl">
                                :
                              </span>
                              <input
                                className="w-[50%]"
                                type="number"
                                onChange={(e) => {
                                  setFieldValue(
                                    "trade_risk",
                                    `${
                                      values?.trade_risk
                                        ?.replace(/ /g, "")
                                        .split(/:/g)[0] || 1
                                    }:${e.target.value}`
                                  );
                                }}
                                value={
                                  values?.trade_risk
                                    ?.replace(/ /g, "")
                                    .split(/:/g)[1] || 1
                                }
                              />
                            </td>
                            <td>
                              <Field type="text" name="reason_for_trade" />
                              <ErrorMessage
                                name="reason_for_trade"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field as="select" name="trade_karma">
                                <option>Select</option>
                                <option value="Satisfied">Satisfied</option>
                                <option value="Unsatisfied">Unsatisfied</option>
                              </Field>
                              <ErrorMessage
                                name="trade_karma"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="text" name="comment" />
                              <ErrorMessage name="comment" component="div" />
                            </td>
                            <td>
                              <Field
                                type="number"
                                name="percentage_of_account_risked"
                              />
                              <ErrorMessage
                                name="percentage_of_account_risked"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="number" name="trade_charges" />
                              <ErrorMessage
                                name="trade_charges"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="number" name="trade_slippage" />
                              <ErrorMessage
                                name="trade_slippage"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="number" name="trade_penalties" />
                              <ErrorMessage
                                name="trade_penalties"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field as="select" name="trading_account">
                                <option>Select</option>
                                {accountList.map((account) => (
                                  <option key={account.account_Id}>
                                    {account?.account_name}
                                  </option>
                                ))}
                                <option value="Account A">Account A</option>
                                <option value="Account B">Account B</option>
                              </Field>
                              <ErrorMessage
                                name="trading_account"
                                component="div"
                              />
                            </td>
                            <td>
                              <Field type="number" name="opening_balance" />
                              <ErrorMessage
                                name="opening_balance"
                                component="div"
                              />
                            </td>
                            <td className="special-col">
                              <input
                                type="file"
                                name="image"
                                id="image"
                                onChange={(e) => setImage(e.target.files[0])}
                              />
                              {showPrev && (
                                <div className="img-preview">
                                  {image && (
                                    <img src={URL.createObjectURL(image)} />
                                  )}
                                </div>
                              )}
                              <button
                                onClick={() => setShowPrev((prev) => !prev)}
                              >
                                Preview
                              </button>
                              <ErrorMessage name="image" component="div" />
                            </td>
                            {/* <td>
                          Render daily questionnaire input field
                          <Field type="text" name="comment" />
                          <ErrorMessage name="comment" component="div" />
                        </td>
                        <td>
                          <Field type="text" name="trade_customizable" />
                          <ErrorMessage
                            name="trade_customizable"
                            component="div"
                          />
                        </td> */}
                            {columnDetail?.length > 0 &&
                              columnDetail?.map((items) => (
                                <td>
                                  <Field
                                    type="text"
                                    name={`${items?.column_name}`}
                                  />
                                  <ErrorMessage
                                    name={`${items?.column_name}`}
                                    component="div"
                                  />
                                </td>
                              ))}
                            {/* {dynamicColumns.map((customHeader, index) => (
                              <td key={index}>
                                <Field name={customHeader} />
                                <ErrorMessage
                                  name={customHeader}
                                  component="div"
                                />
                              </td>
                            ))} */}

                            <td>
                              <Field
                                type="text"
                                name="dynamicColumnsField"
                                value={`${values.dynamicColumnsField}`}
                                onChange={(e) =>
                                  setFieldValue(
                                    "dynamicColumnsField",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFieldValue("dynamicColumnsField", "");
                                  dispatch(
                                    createColumnData({
                                      token: token,
                                      data: values.dynamicColumnsField,
                                    })
                                  );
                                }}
                              >
                                Add Column
                              </button>
                            </td>
                            <td> </td>
                            <td>
                              <button
                                type="button"
                                className="submit-btn"
                                onClick={() => {
                                  handleSubmit();
                                }}
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        )
                      }
                    </Formik>
                    {tradeList?.length > 0 &&
                      tradeList?.map((item, index) => {
                        return (
                          <Formik
                            key={index}
                            initialValues={{
                              asset_class: item?.asset_class || "",
                              position_size: item?.position_size || "",
                              points_captured: item?.points_captured || "",
                              trade_pnl: item?.trade_pnl || "",
                              position: item?.position || "",
                              buy_sell: item?.buy_sell || "",
                              trade_remark: item?.trade_remark || "",
                              trade_karma: item?.trade_karma || "",
                              trade_date1: new Date(item?.trade_date) || "",
                              holding_trade_type:
                                item?.holding_trade_type || "",
                              trade_charges: item?.trade_charges || "",
                              trading_account: item?.trading_account || "",
                              stop_loss: item?.stop_loss || "",
                              trade_target: item?.trade_target || "",
                              trade_conviction: item?.trade_conviction || "",
                              strategy_used: item?.strategy_used || "",
                              trade_risk: item?.trade_risk || "",
                              reason_for_trade: item?.reason_for_trade || "",
                              percentage_of_account_risked:
                                item?.percentage_of_account_risked || "",
                              image: item?.image || "",
                              trade_slippage: item?.trade_slippage || "",
                              trade_penalties: item?.trade_penalties || "",
                              net_roi: item?.net_roi || "",
                              trade_customizable:
                                item?.trade_customizable || "",
                              opening_balance: item?.opening_balance || "",
                              trade_tags: item?.trade_tags || "",
                              comment: item?.comment || "",
                              dynamicColumn:
                                item?.dynamicColumn.length > 0
                                  ? matchAndMapColumns(
                                      columnDetail,
                                      item?.dynamicColumn
                                    )
                                  : [],
                            }}
                            validationSchema={tradeSchema}
                            innerRef={formikRef}
                            onSubmit={handlesSubmit}
                          >
                            {({
                              isSubmitting,
                              values,
                              setFieldValue,
                              handleSubmit,
                            }) => {
                              return (
                                <tr key={index} className={index}>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <ReactDatePicker
                                        id="trade_date1"
                                        name="trade_date1"
                                        closeOnScroll={true}
                                        selected={
                                          values?.trade_date1 || startDate1
                                        }
                                        onChange={(date) => {
                                          setStartDate1(date);
                                          setFieldValue("trade_date", date);
                                          setFieldValue("trade_date1", date);
                                          modifyExistingData(
                                            "trade_date1",
                                            index,
                                            date
                                          );
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                      />
                                    ) : (
                                      new Date(
                                        item?.trade_date
                                      ).toLocaleDateString("en-CA")
                                    )}
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name="asset_class"
                                      id="asset_class"
                                      value={item?.asset_class}
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                      disabled={!edit}
                                    >
                                      <option value="Equity">Equity</option>
                                      <option value="Features">Features</option>
                                      <option value="Options">Options</option>
                                      <option value="Currency">Currency</option>
                                      <option value="Commodity">
                                        Commodity
                                      </option>
                                      <option value="Crypto">Crypto</option>
                                    </Field>
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="position"
                                          onChange={(e) => {
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            );
                                          }}
                                          value={item?.position}
                                        />
                                        <ErrorMessage
                                          name="position"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.position
                                    )}
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name="buy_sell"
                                      disabled={!edit}
                                      value={item?.buy_sell}
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option>Select</option>
                                      <option value="Buy">Buy</option>
                                      <option value="Sell">Sell</option>
                                    </Field>
                                    <ErrorMessage
                                      name="buy_sell"
                                      component="div"
                                    />
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="number"
                                          name="position_size"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.valueAsNumber
                                            )
                                          }
                                          value={item?.position_size}
                                        />
                                        <ErrorMessage
                                          name="position_size"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.position_size
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="number"
                                          name="stop_loss"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.valueAsNumber
                                            )
                                          }
                                          value={item?.stop_loss}
                                        />
                                        <ErrorMessage
                                          name="stop_loss"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.stop_loss
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="trade_target"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.trade_target}
                                        />
                                        <ErrorMessage
                                          name="trade_target"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.trade_target
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="number"
                                          name="trade_pnl"
                                          onChange={(e) => {
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.valueAsNumber
                                            );
                                          }}
                                          value={item?.trade_pnl}
                                        />
                                        <ErrorMessage
                                          name="trade_pnl"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      ` ₹ ${item?.trade_pnl}`
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="points_captured"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.points_captured}
                                        />
                                        <ErrorMessage
                                          name="points_captured"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.points_captured
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="net_roi"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.net_roi}
                                        />
                                        <ErrorMessage
                                          name="net_roi"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.net_roi
                                    )}
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name="strategy_used"
                                      disabled={!edit}
                                      value={item?.strategy_used}
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option>Select</option>
                                      <option value="Strategy 1">
                                        Strategy 1
                                      </option>
                                      <option value="Strategy 2">
                                        Strategy 2
                                      </option>
                                    </Field>
                                    <ErrorMessage
                                      name="strategy_used"
                                      component="div"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name="holding_trade_type"
                                      disabled={!edit}
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                      value={item?.holding_trade_type}
                                    >
                                      <option>Select</option>
                                      <option value="Positional">
                                        Positional
                                      </option>
                                      <option value="Intraday">Intraday</option>
                                      <option value="Swing">Swing</option>
                                      <option value="Short Term">
                                        Short Term
                                      </option>
                                      <option value="Long Term">
                                        Long Term
                                      </option>
                                      <option value="Expiry">Expiry</option>
                                      <option value="BTST">BTST</option>
                                    </Field>
                                    <ErrorMessage
                                      name="holding_trade_type"
                                      component="div"
                                    />
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name="trade_conviction"
                                      disabled={!edit}
                                      value={item?.trade_conviction}
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option>Select</option>
                                      <option value="Low">Low</option>
                                      <option value="Medium">Medium</option>
                                      <option value="High">High</option>
                                    </Field>
                                    <ErrorMessage
                                      name="trade_conviction"
                                      component="div"
                                    />
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <input
                                          className="w-[50%]"
                                          type="number"
                                          onChange={(e) => {
                                            modifyExistingData(
                                              "trade_risk",
                                              index,
                                              `${e.target.value}:${
                                                item?.trade_risk
                                                  ?.replace(/ /g, "")
                                                  .split(/:/g)[1] || 1
                                              }`
                                            );
                                          }}
                                          value={
                                            item?.trade_risk
                                              ?.replace(/ /g, "")
                                              .split(/:/g)[0] || 1
                                          }
                                        />
                                        <span className="font-bold, mx-2 text-center text-2xl">
                                          :
                                        </span>
                                        <input
                                          className="w-[50%]"
                                          type="number"
                                          onChange={(e) => {
                                            modifyExistingData(
                                              "trade_risk",
                                              index,
                                              `${
                                                item?.trade_risk
                                                  ?.replace(/ /g, "")
                                                  .split(/:/g)[0] || 1
                                              }:${e.target.value}`
                                            );
                                          }}
                                          value={
                                            item?.trade_risk
                                              ?.replace(/ /g, "")
                                              .split(/:/g)[1] || 1
                                          }
                                        />
                                      </>
                                    ) : (
                                      item?.trade_risk
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="reason_for_trade"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.reason_for_trade}
                                        />
                                        <ErrorMessage
                                          name="reason_for_trade"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.reason_for_trade
                                    )}
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name="trade_karma"
                                      disabled={!edit}
                                      value={item?.trade_karma}
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option>Select</option>
                                      <option value="Satisfied">
                                        Satisfied
                                      </option>
                                      <option value="Unsatisfied">
                                        Unsatisfied
                                      </option>
                                    </Field>
                                    <ErrorMessage
                                      name="trade_karma"
                                      component="div"
                                    />
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="comment"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.comment}
                                        />
                                        <ErrorMessage
                                          name="comment"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.comment
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="percentage_of_account_risked"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={
                                            item?.percentage_of_account_risked
                                          }
                                        />
                                        <ErrorMessage
                                          name="percentage_of_account_risked"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.percentage_of_account_risked
                                    )}
                                  </td>
                                  <td>
                                    {/* <Field type="number" name="trade_charges" />
                                <ErrorMessage
                                  name="trade_charges"
                                  component="div"
                                /> */}
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="trade_charges"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.trade_charges}
                                        />
                                        <ErrorMessage
                                          name="trade_charges"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      ` ₹ ${item?.trade_charges}`
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="trade_slippage"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.trade_slippage}
                                        />
                                        <ErrorMessage
                                          name="trade_slippage"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.trade_slippage
                                    )}
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="trade_penalties"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={item?.trade_penalties}
                                        />
                                        <ErrorMessage
                                          name="trade_penalties"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      ` ₹ ${item?.trade_penalties}`
                                    )}
                                  </td>
                                  <td>
                                    <Field
                                      as="select"
                                      name="trading_account"
                                      disabled={!edit}
                                      value={item?.trading_account}
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option>Select</option>
                                      <option value="Account A">
                                        Account A
                                      </option>
                                      <option value="Account B">
                                        Account B
                                      </option>
                                    </Field>
                                    <ErrorMessage
                                      name="trading_account"
                                      component="div"
                                    />
                                  </td>
                                  <td>
                                    {id === item?.id || edit ? (
                                      <>
                                        <Field
                                          type="text"
                                          name="opening_balance"
                                          onChange={(e) =>
                                            modifyExistingData(
                                              e.target.name,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          value={
                                            item?.opening_balance &&
                                            item?.opening_balance
                                          }
                                        />
                                        <ErrorMessage
                                          name="opening_balance"
                                          component="div"
                                        />
                                      </>
                                    ) : (
                                      item?.opening_balance &&
                                      parseFloat(item?.opening_balance).toFixed(
                                        2
                                      )
                                    )}
                                  </td>
                                  <td>
                                    <img
                                      src={item?.image}
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        margin: "auto",
                                      }}
                                    />
                                  </td>
                                  {/* displaying dynamic fields*/}
                                  {item?.dynamicColumn?.length > 0 &&
                                    matchAndMapColumns(
                                      columnDetail,
                                      item?.dynamicColumn
                                    ).map((items) => (
                                      <td>
                                        {id === item?.id || edit ? (
                                          <>
                                            <Field
                                              type="text"
                                              name={`${items?.name}`}
                                              onChange={(e) => {
                                                modifyExistingDynamicColumnData(
                                                  e.target.name,
                                                  index,
                                                  e.target.value
                                                );
                                              }}
                                              value={matchAndMapColumns(
                                                columnDetail,
                                                item?.dynamicColumn
                                              ).find(
                                                (el) =>
                                                  el?.name === items?.name
                                              )?.value}
                                            />
                                            <ErrorMessage
                                              name={`${items?.name}`}
                                              component="div"
                                            />
                                          </>
                                        ) : (
                                          items?.value
                                        )}
                                      </td>
                                    ))}
                                  <td> </td>
                                  <td>
                                    <button
                                      onClick={() => {
                                        onOpenQuestionnaire(item?.id);
                                      }}
                                    >
                                      Fill up DailyQuestionnaire
                                    </button>
                                  </td>

                                  {/* {columnDetail?.length > 0
                                    ? columnDetail?.map((items) => (
                                        <td>
                                          {edit ? (
                                            <>
                                              <Field
                                                type="text"
                                                name={`${items?.column_name}`}
                                                onChange={(e) =>
                                                  modifyExistingData(
                                                    e.target.name,
                                                    index,
                                                    e.target.value
                                                  )
                                                }
                                                value={item[items?.column_name]}
                                              />
                                              <ErrorMessage
                                                name={`${items?.column_name}`}
                                                component="div"
                                              />
                                            </>
                                          ) : (
                                            item[items?.column_name]
                                          )}
                                        </td>
                                      ))
                                    : null} */}

                                  {/* <td>
                                {edit ? (
                                  <>
                                    <Field
                                      type="text"
                                      name="comment"
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                      value={item?.comment}
                                    />
                                    <ErrorMessage
                                      name="comment"
                                      component="div"
                                    />
                                  </>
                                ) : (
                                  item?.comment
                                )}
                              </td>
                              <td>
                                {edit ? (
                                  <>
                                    <Field
                                      type="text"
                                      name="trade_customizable"
                                      onChange={(e) =>
                                        modifyExistingData(
                                          e.target.name,
                                          index,
                                          e.target.value
                                        )
                                      }
                                      value={item?.trade_customizable}
                                    />
                                    <ErrorMessage
                                      name="trade_customizable"
                                      component="div"
                                    />
                                  </>
                                ) : (
                                  item?.trade_customizable
                                )}
                              </td> */}

                                  <td>
                                  {/* 
                                    {!(id === item?.id) ? (
                                      <button
                                        type="button"
                                        className="button"
                                        onClick={() => {
                                          setId(item?.id);
                                        }}
                                      >
                                        Edit
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="button"
                                        onClick={handleEditSubmit}
                                      >
                                        Save
                                      </button>
                                    )}
                                  */}
                                  </td> 
                                </tr>
                              );
                            }}
                          </Formik>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <Pagination
            pageDetail={pageDetail}
            reduxData={reduxData}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handlePageClick={handlePageClick}
          />
        </div>
      ) :isLoading?<Loader/>: reduxData.data?.length === 0 ? (
        <>
          {popUp && (
            <div ref={ref}>
              <PopUpFilter
                closePopUp={closePopUp}
                setTradeList={setTradeList}
              />
            </div>
          )}
          <div className="customFilterButton">
                  <ul>
                    <li onClick={togglePopUp}>
                      Filters{" "}
                      <span>
                        <img src={FilterIcon} alt="main filter" />
                      </span>
                    </li>
                  </ul>
          </div>
          <div className="main-content demo-b">
            <div className="tradelog-tbl">
              <div className="table_wrapper">
                <div className="table-responsive">
                  <Table cellSpacing="0" cellPadding="0">
                    <thead>
                      <tr>
                        {tableHeading.map((header, index) => (
                          <th key={header}>
                            {header}
                            <span
                              className="sort-arrow"
                              onClick={() =>
                                setSort((prev) => {
                                  if (
                                    prev?.label === "" ||
                                    prev?.label !== header
                                  ) {
                                    setSort((prev) => ({
                                      ...prev,
                                      label: header,
                                      sort: "ASC",
                                    }));
                                    sortDataBy(
                                      tradeList,
                                      tableHeadingObj[header]
                                    );
                                  } else if (
                                    prev?.label === header &&
                                    prev?.label === "ASC"
                                  ) {
                                    setSort((prev) => ({
                                      ...prev,
                                      label: header,
                                      sort: "DESC",
                                    }));
                                    sortDataBy(
                                      tradeList,
                                      tableHeadingObj[header]
                                    );
                                  } else if (
                                    prev?.label === header &&
                                    prev?.label === "DESC"
                                  ) {
                                    setSort((prev) => ({
                                      ...prev,
                                      label: header,
                                      sort: "ASC",
                                    }));
                                    sortDataBy(
                                      tradeList,
                                      tableHeadingObj[header]
                                    );
                                  }
                                })
                              }
                            >
                              <img
                                style={{ cursor: "pointer" }}
                                src={
                                  sort?.label === header
                                    ? sort?.sort === "ASC"
                                      ? ArrowUP
                                      : DownArrow
                                    : DownArrow
                                }
                              />
                            </span>
                          </th>
                        ))}
                        {columnDetail?.length > 0 &&
                          columnDetail?.map((header, index) => (
                            <th key={index}>{header?.column_name}<button onClick={()=>{deleteColumn(header?.id)}}>Delete</button></th>
                          ))}
                        {/* {dynamicColumns.map((customHeader, index) => (
                        <th key={index}>{customHeader}</th>
                      ))} */}
                        <th key={"addColumn"}>Dynamic Column</th>
                        <th key={"heads"}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Formik
                        initialValues={{
                          asset_class: "",
                          position_size: "",
                          points_captured: "",
                          trade_pnl: "",
                          position: "",
                          buy_sell: "",
                          trade_remark: "",
                          trade_karma: "",
                          trade_date: "",
                          holding_trade_type: "",
                          trade_charges: "",
                          trading_account: "",
                          stop_loss: "",
                          trade_target: "",
                          trade_conviction: "",
                          strategy_used: "",
                          trade_risk: "",
                          reason_for_trade: "",
                          percentage_of_account_risked: "",
                          image: "",
                          trade_slippage: "",
                          trade_penalties: "",
                          net_roi: "",
                          trade_customizable: "",
                          opening_balance: "",
                          trade_tags: "",
                          comment: "",
                          dynamicColumnsField: "",
                          ...columnDetail?.reduce((acc, item) => {
                            acc[item?.column_name] = "";
                            return acc;
                          }, {}),
                          dynamicColumn: [],
                        }}
                        validationSchema={tradeSchema}
                        onSubmit={handleAddSubmit}
                      >
                        {({
                          values,
                          setFieldValue,
                          isSubmitting,
                          handleSubmit,
                        }) =>
                          !edit && (
                            <tr key={"first"} className="first">
                              <td>
                                <ReactDatePicker
                                  id="trade_date"
                                  name="trade_date"
                                  closeOnScroll={true}
                                  selected={startDate}
                                  onChange={(date) => {
                                    setStartDate(date);
                                    setFieldValue("trade_date", date); // Update the formik value
                                  }}
                                  dateFormat="yyyy-MM-dd"
                                />
                                <ErrorMessage
                                  name="trade_date"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field as="select" name="asset_class">
                                  <option>Select</option>
                                  <option value="Equity">Equity</option>
                                  <option value="Features">Features</option>
                                  <option value="Options">Options</option>
                                  <option value="Currency">Currency</option>
                                  <option value="Commodity">Commodity</option>
                                  <option value="Crypto">Crypto</option>
                                </Field>
                                <ErrorMessage
                                  name="asset_class"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="text" name="position" />
                                <ErrorMessage name="position" component="div" />
                              </td>
                              <td>
                                <Field as="select" name="buy_sell">
                                  <option>Select</option>
                                  <option value="Buy">Buy</option>
                                  <option value="Sell">Sell</option>
                                </Field>
                                <ErrorMessage name="buy_sell" component="div" />
                              </td>
                              <td>
                                <Field type="number" name="position_size" />
                                <ErrorMessage
                                  name="position_size"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="stop_loss" />
                                <ErrorMessage
                                  name="stop_loss"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="trade_target" />
                                <ErrorMessage
                                  name="trade_target"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field
                                  type="number"
                                  name="trade_pnl"
                                  // onChange={(e) => {
                                  //   console.log("value", e.target.value);

                                  //   const value = e.target.valueAsNumber;

                                  //   // setHoldPl((prev) => value);
                                  //   // if (!value) {
                                  //   //   return;
                                  //   // }
                                  // }}
                                  // value={holdPl}
                                />
                                <ErrorMessage
                                  name="trade_pnl"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="points_captured" />
                                <ErrorMessage
                                  name="points_captured"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="net_roi" />
                                <ErrorMessage name="net_roi" component="div" />
                              </td>
                              <td>
                                <Field as="select" name="strategy_used">
                                  <option>Select</option>
                                  {strategies?.length > 0 &&
                                    strategies.map((el) => (
                                      <option key={el.strategies_name}>
                                        {el.strategies_name}
                                      </option>
                                    ))}
                                  {/* <option value="Strategy 1">Strategy 1</option>
                            <option value="Strategy 2">Strategy 2</option> */}
                                </Field>
                                <ErrorMessage
                                  name="strategy_used"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field as="select" name="holding_trade_type">
                                  <option>Select</option>
                                  <option value="Positional">Positional</option>
                                  <option value="Intraday">Intraday</option>
                                  <option value="Swing">Swing</option>
                                  <option value="Short Term">Short Term</option>
                                  <option value="Long Term">Long Term</option>
                                  <option value="Expiry">Expiry</option>
                                  <option value="BTST">BTST</option>
                                </Field>
                                <ErrorMessage
                                  name="holding_trade_type"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field as="select" name="trade_conviction">
                                  <option>Select</option>
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                </Field>
                                <ErrorMessage
                                  name="trade_conviction"
                                  component="div"
                                />
                              </td>
                              {/* <td>
                          <Field type="text" name="trade_risk" />
                          <ErrorMessage name="trade_risk" component="div" />
                        </td> */}
                              <td>
                                <input
                                  className="w-[50%]"
                                  type="number"
                                  onChange={(e) => {
                                    setFieldValue(
                                      "trade_risk",
                                      `${e.target.value}:${
                                        values?.trade_risk
                                          ?.replace(/ /g, "")
                                          .split(/:/g)[1] || 1
                                      }`
                                    );
                                  }}
                                  value={
                                    values?.trade_risk
                                      ?.replace(/ /g, "")
                                      .split(/:/g)[0] || 1
                                  }
                                />
                                <span className="font-bold, mx-2 text-center text-2xl">
                                  :
                                </span>
                                <input
                                  className="w-[50%]"
                                  type="number"
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                    setFieldValue(
                                      "trade_risk",
                                      `${
                                        values?.trade_risk
                                          ?.replace(/ /g, "")
                                          .split(/:/g)[0] || 1
                                      }:${e.target.value}`
                                    );
                                  }}
                                  value={
                                    values?.trade_risk
                                      ?.replace(/ /g, "")
                                      .split(/:/g)[1] || 1
                                  }
                                />
                              </td>
                              <td>
                                <Field type="text" name="reason_for_trade" />
                                <ErrorMessage
                                  name="reason_for_trade"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field as="select" name="trade_karma">
                                  <option>Select</option>
                                  <option value="Satisfied">Satisfied</option>
                                  <option value="Unsatisfied">
                                    Unsatisfied
                                  </option>
                                </Field>
                                <ErrorMessage
                                  name="trade_karma"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="text" name="comment" />
                                <ErrorMessage name="comment" component="div" />
                              </td>
                              <td>
                                <Field
                                  type="number"
                                  name="percentage_of_account_risked"
                                />
                                <ErrorMessage
                                  name="percentage_of_account_risked"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="trade_charges" />
                                <ErrorMessage
                                  name="trade_charges"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="trade_slippage" />
                                <ErrorMessage
                                  name="trade_slippage"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="trade_penalties" />
                                <ErrorMessage
                                  name="trade_penalties"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field as="select" name="trading_account">
                                  <option>Select</option>
                                  {accountList.map((account) => (
                                    <option key={account.account_Id}>
                                      {account?.account_name}
                                    </option>
                                  ))}
                                  <option value="Account A">Account A</option>
                                  <option value="Account B">Account B</option>
                                </Field>
                                <ErrorMessage
                                  name="trading_account"
                                  component="div"
                                />
                              </td>
                              <td>
                                <Field type="number" name="opening_balance" />
                                <ErrorMessage
                                  name="opening_balance"
                                  component="div"
                                />
                              </td>
                              <td className="special-col">
                                <input
                                  type="file"
                                  name="image"
                                  id="image"
                                  onChange={(e) => setImage(e.target.files[0])}
                                />
                                {showPrev && (
                                  <div className="img-preview">
                                    {image && (
                                      <img src={URL.createObjectURL(image)} />
                                    )}
                                  </div>
                                )}
                                <button
                                  onClick={() => setShowPrev((prev) => !prev)}
                                >
                                  Preview
                                </button>
                                <ErrorMessage name="image" component="div" />
                              </td>
                              {columnDetail?.length > 0 &&
                                columnDetail?.map((items) => (
                                  <td>
                                    <Field
                                      type="text"
                                      name={`${items?.column_name}`}
                                    />
                                    <ErrorMessage
                                      name={`${items?.column_name}`}
                                      component="div"
                                    />
                                  </td>
                                ))}
                              {/* {dynamicColumns.map((customHeader, index) => (
                              <td key={index}>
                                <Field name={customHeader} />
                                <ErrorMessage
                                  name={customHeader}
                                  component="div"
                                />
                              </td>
                            ))} */}

                              <td>
                                <Field
                                  type="text"
                                  name="dynamicColumnsField"
                                  value={`${values.dynamicColumnsField}`}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "dynamicColumnsField",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDynamicColumns((prevColumns) => [
                                      ...prevColumns,
                                      values.dynamicColumn,
                                    ]);
                                    setFieldValue("dynamicColumnsField", ""); // Clear the input field after adding
                                    dispatch(
                                      createColumnData({
                                        token: token,
                                        data: values.dynamicColumnsField,
                                      })
                                    );
                                  }}
                                >
                                  Add Column
                                </button>
                              </td>
                              {/* <td>
                          Render daily questionnaire input field
                          <Field type="text" name="comment" />
                          <ErrorMessage name="comment" component="div" />
                        </td>
                        <td>
                          <Field type="text" name="trade_customizable" />
                          <ErrorMessage
                            name="trade_customizable"
                            component="div"
                          />
                        </td> */}
                              {/* {columnDetail?.length > 0 &&
                          columnDetail?.map((items) => (
                            <td>
                              <Field
                                type="text"
                                name={`${items?.column_name}`}
                              />
                              <ErrorMessage
                                name={`${items?.column_name}`}
                                component="div"
                              />
                            </td>
                          ))} */}
                              <td>
                                <button
                                  type="button"
                                  className="submit-btn"
                                  onClick={handleSubmit}
                                >
                                  Save
                                </button>
                              </td>
                            </tr>
                          )
                        }
                      </Formik>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={NoTradeData} alt="noTradeLogDataFound" />
          </div>
        </>
      ) : (
        <div className="customFilterButton">
          <ul>
            <button
              className="flex justify-center items-center cursor-pointer"
              disabled
              onClick={() => {
                setEdit(true);
              }}
            >
              Edit{" "}
              <span>
                <img src={EditIcon} alt="edit filter" />
              </span>
            </button>
            <button onClick={togglePopUp} className=" cursor-pointer" disabled>
              Filters{" "}
              <span>
                <img src={FilterIcon} alt="main filter" />
              </span>
            </button>
          </ul>
        </div>
      )}
    </>
  );
}

export default TradeLog;
