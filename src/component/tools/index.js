import React, { useEffect, forwardRef, useState, useRef } from "react";
import "./tools.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addCurrentTab,
  getUploadedTradebookFile,
  loadingStatus,
  uploadPreviousTradebookFile,
  updateTradebookData,
} from "../../store/slice/toolSlice";
import { Button, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import arrowDown from "./../../assets/images/arrowDown.svg";
import TradeLog from "../tradeLog";
import FutureSimulator from "./FutureSimulator";
import PreviousTradebook from "./PreviousTradebook";
import * as XLSX from "xlsx";
import { sessionList, sessionAdd } from "../../store/slice/sessionSlice";

const Tools = () => {
  const [pastedData, setPastedData] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const fileRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);
  const [toolsHeadersCurrent, settoolsHeadersCurrent] = useState("Sessions");
  const [path, setPath] = useState("tools/sessions");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const dispatch = useDispatch();
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

  const toggleExpand = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

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

  const uploadToServer = () => {
    if (fileRef.current) {
      dispatch(
        uploadPreviousTradebookFile({ file: fileRef.current, token: token })
      );
      fileInputRef.current.value = null;
      return;
    }
    if (pastedData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(pastedData, { skipHeader: true });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

      const blob = new Blob(
        [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "tradebook-file.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      const excelFile = new File([blob], "tradebook-file.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      dispatch(uploadPreviousTradebookFile({ file: excelFile, token: token }));
    }
  };

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

  const handleFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      dispatch(updateTradebookData(parsedData));
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
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    fileRef.current = file;

    if (file) {
      handleFile(file);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("Text");
    const newDataa = pastedText.split("\n").map((row) => row.split("\t"));
    const newData = pastedText.split("\n").map((row) => {
      const rowValues = row.split("\t");
      return { values: rowValues };
    });
    dispatch(updateTradebookData(newDataa));
    setPastedData(newDataa);
    setData(newData);
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
    ) {
      dispatch(sessionAdd({ ...sessionsFormData.current, token: token }));
      onResetSessionsData();
    } else {
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

  useEffect(() => {
    dispatch(sessionList(token));
    dispatch(getUploadedTradebookFile(token));
  }, [isAddedOrEdited === true]);

  useEffect(() => {
    if (reduxData.session?.data.length) {
      setSessions((prev) => reduxData.session?.data);
    }
  }, [reduxData]);

  useEffect(() => {
    if (
      reduxData.tools.data.length > 0 &&
      reduxData.tools.currentTab == "Previous Tradebook"
    ) {
      const data = reduxData.tools.data;
      const newData = data.map((row) => {
        return { values: row };
      });
      setData(newData);
    }
  }, [reduxData.tools.data, reduxData.tools.currentTab]);

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
                <Button
                  variant="outline-primary"
                  className="reset-button"
                  onClick={uploadToServer}
                >
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
                <textarea
                  onPaste={handlePaste}
                  placeholder="You can import any excel file or Paste Excel data here"
                  style={{
                    width: "100%",
                    resize: "none",
                    padding: "10px",
                    border: "1px solid #E4E4E4",
                    borderRadius: "12px",
                    height: "120px",
                    textAlign: "center",
                    lineHeight: "90px",
                  }}
                ></textarea>
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
