import React, { useEffect, forwardRef, useState, useRef } from "react";
import "./tools.css";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentTab, loadingStatus } from "../../store/slice/toolSlice";
import { Button, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import arrowDown from "./../../assets/images/arrowDown.svg";
import TradeLog from "../tradeLog";
import FutureSimulator from "./FutureSimulator";
import PreviousTradebook from "./PreviousTradebook";
import * as XLSX from "xlsx";
import { sessionList, sessionAdd } from "../../store/slice/sessionSlice";

const Tools = () => {
  const [expandedIndexes, setExpandedIndexes] = useState([]);

  const toggleExpand = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };
  const [sessions, setSessions] = useState([]);
  const sessionsFormData = useRef({
    session_startDate: null,
    session_endDate: null,
    session_category: null,
    session_rating: null,
    session_lessonsLearned: null,
  });
  const isAddedOrEdited = useSelector(
    (state) => state?.session?.isAddedOrEdited
  );

  const reduxData = useSelector((state) => state);
  useEffect(() => {
    dispatch(sessionList(token));
  }, [isAddedOrEdited === true]);
  useEffect(() => {
    if (reduxData.session?.data.length) {
      setSessions((prev) => reduxData.session?.data);
    }
  }, [reduxData]);
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const token = reduxData?.auth?.token;
  const [toolsHeaders, settoolsHeaders] = useState([
    { name: "Sessions", active: true, path: "tools/sessions" },
    { name: "Missed Trade Log", active: false, path: "tools/missed-trade-log" },
    {
      name: "Future Simulator",
      active: false,
      path: "tools/future-simulator",
    },
    {
      name: "Previous Tradebook",
      active: false,
      path: "tools/previous-tradebook",
    },
  ]);
  const [toolsHeadersCurrent, settoolsHeadersCurrent] = useState("Sessions");
  const [mainData, setMainData] = useState([]);
  const [path, setPath] = useState("tools/sessions");

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    if (reduxData.tools.data && reduxData.tools.currentTab == "Sessions") {
      const data = reduxData.tools.data;
      const blankArr = [];
      for (const [key, value] of Object.entries(data)) {
        blankArr.push({ name: key, value: value ? value.toFixed(2) : value });
      }
      setMainData((prev) => blankArr);
    }
  }, [reduxData.tools.data]);

  const currentHeader = (position) => {
    dispatch(addCurrentTab(toolsHeaders[position].name));
    settoolsHeadersCurrent((prev) => toolsHeaders[position].name);
    setPath((prev) => toolsHeaders[position].path);
    settoolsHeaders((prev) => {
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
  const ExampleCustomInput = forwardRef(
    ({ value, onClick, placeholder }, ref) => (
      <button className="customDateInput" onClick={onClick} ref={ref}>
        {value ? value : placeholder}
        <span className="arrow-icon">
          <img src={arrowDown} alt="arrow-down" height="14px" />
        </span>
      </button>
    )
  );

  const handleFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const header = parsedData[0];

      const formattedData = parsedData.map((row, index) => {
        return {
          id: index + 1,
          values: row,
        };
      });

      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleButtonClick = () => {
    // Trigger file input click programmatically
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      handleFile(file);
    }
  };

  const onSaveSession = () => {
    if (
      sessionsFormData.current.startDate != null ||
      (sessionsFormData.current.startDate != "" &&
        sessionsFormData.current.endDate != null) ||
      (sessionsFormData.current.endDate != "" &&
        sessionsFormData.current.session_category != null) ||
      (sessionsFormData.current.session_category != "" &&
        sessionsFormData.current.session_rating != null) ||
      (sessionsFormData.current.session_rating != "" &&
        sessionsFormData.current.session_lessonsLearned != null) ||
      sessionsFormData.current.session_lessonsLearned != ""
    ){
      dispatch(sessionAdd({ ...sessionsFormData.current, token: token }));
      // dispatch(sessionList(token));
      onResetSessionsData();
    }
    else {
      console.log("Fill all the required fields first..");
    }
  };

  const onResetSessionsData = () => {
    sessionsFormData.current.session_startDate = null;
    sessionsFormData.current.session_endDate = null;
    sessionsFormData.current.session_category = null;
    sessionsFormData.current.session_rating = null;
    sessionsFormData.current.session_lessonsLearned = null;
  };

  function formatDate(dateString) {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  return (
    <>
      {
        <div className="tools">
          <div className="toolsHeader">
            <ul className="toolsHeaderList">
              {toolsHeaders.length &&
                toolsHeaders.map((item, i) => {
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
            {toolsHeadersCurrent == "Sessions" ? (
              <>
                <Button
                  variant="primary"
                  className="reset-button"
                  onClick={onSaveSession}
                >
                  Save
                </Button>
                <Button
                  variant="outline-primary"
                  className="reset-button"
                  onClick={onResetSessionsData}
                >
                  Reset
                </Button>
              </>
            ) : toolsHeadersCurrent == "Previous Tradebook" ? (
              <div className="buttons-section">
                <Button variant="outline-primary" className="reset-button">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  className="reset-button"
                  style={{ backgroundColor: "#0075ff" }}
                  onClick={handleButtonClick}
                >
                  Import File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {toolsHeadersCurrent == "Sessions" ? "" : ""}
          <div className="toolsBody">
            {reduxData.tools.currentTab == "Sessions" ? (
              <>
                <Container className="sessions-container">
                  <Row>
                    <Col lg={3}>
                      <Container>
                        <Row className="customSessionRow">
                          <Col>
                            <DatePicker
                              selected={startDate}
                              onChange={(date) => {
                                setStartDate(date);
                                sessionsFormData.current.session_startDate =
                                  date;
                              }}
                              dateFormat="dd/MM/yyyy"
                              customInput={<ExampleCustomInput />}
                              placeholderText="Start Date"
                            />
                          </Col>
                        </Row>
                        <Row className="customSessionRow">
                          <Col>
                            <DatePicker
                              selected={endDate}
                              onChange={(date) => {
                                setEndDate(date);
                                sessionsFormData.current.session_endDate = date;
                              }}
                              dateFormat="dd/MM/yyyy"
                              customInput={<ExampleCustomInput />}
                              placeholderText="End Date"
                            />
                          </Col>
                        </Row>
                        <Row className="customSessionRow">
                          <Col>
                            <div className="customDateInput ">
                              <select
                                className="select-width "
                                onChange={(e) => {
                                  sessionsFormData.current.session_rating =
                                    e.target.value;
                                }}
                              >
                                <option>Select Rating</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                              </select>
                            </div>
                          </Col>
                        </Row>
                        <Row className="customSessionRow">
                          <Col>
                            <input
                              type="text"
                              className="customDateInput"
                              placeholder="Sessions Category"
                              onChange={(e) => {
                                sessionsFormData.current.session_category =
                                  e.target.value;
                              }}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                    <Col lg={9} className="sessions-lessons">
                      <textarea
                        placeholder="Lessons Learned (max 300 characters)"
                        className="customDateInput"
                        onChange={(e) => {
                          sessionsFormData.current.session_lessonsLearned =
                            e.target.value;
                        }}
                      />
                    </Col>
                  </Row>
                </Container>
                {sessionList.length > 0 && (
                  <Container>
                    <Row style={{ height: "20px" }}></Row>
                    <Row>
                      <Col style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: "500", fontSize: "20px" }}>
                          Previous added sessions
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <table className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Category</th>
                              <th>Rating</th>
                              <th>Lessons Learned</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sessions.map((item, i) => {
                              const shortText =
                                item.session_lessonsLearned.substring(0, 50);
                              const fullText = item.session_lessonsLearned;
                              const isExpanded = expandedIndexes.includes(i);

                              return (
                                <tr key={i}>
                                  <td>{formatDate(item.session_startDate)}</td>
                                  <td>{formatDate(item.session_endDate)}</td>
                                  <td>{item.session_category}</td>
                                  <td>{item.session_rating}</td>
                                  <td
                                    style={{
                                      width: "250px",
                                      maxWidth: "250px", // Adjust the value based on your preference
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    {isExpanded ? (
                                      <>
                                        {fullText}
                                        <a
                                          href="#"
                                          onClick={() => toggleExpand(i)}
                                        >
                                          ...View less
                                        </a>
                                      </>
                                    ) : (
                                      <>
                                        {shortText}
                                        {fullText.length > 50 && (
                                          <>
                                            {" "}
                                            <a
                                              href="#"
                                              onClick={() => toggleExpand(i)}
                                            >
                                              ...Read more
                                            </a>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </Container>
                )}
              </>
            ) : reduxData.tools.currentTab === "Missed Trade Log" ? (
              <>
                <TradeLog />
              </>
            ) : reduxData.tools.currentTab === "Future Simulator" ? (
              <>
                <FutureSimulator />
              </>
            ) : reduxData.tools.currentTab === "Previous Tradebook" ? (
              <>
                <PreviousTradebook data={data} />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      }
    </>
  );
};

export default Tools;
