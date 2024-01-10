import { useEffect } from "react";
import BarChart from "../BarChart/BarChart";
import "./home.scss";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { getDashbordData } from "../../store/slice/homeSlice";
import CurveChart from "../Charts/CurveChart";
import { GroupedBarChart } from "../Charts/GroupedBarChart";
import { DailyPnlChart } from "../Charts/DailyPnlChart";
import { insightsData } from "./data";

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.token);
  const dataList = useSelector((state) => state?.dashboard?.data);

  useEffect(() => {
    dispatch(getDashbordData(token));
  }, []);

  const isOneMonthGap = (startDate, endDate) => {
    // Assuming startDate and endDate are Date objects
    if (startDate && endDate) {
      const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000; // Assuming 30 days in a month
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculate the difference in milliseconds
      const timeDiff = end.getTime() - start.getTime();

      // Check if the difference is greater than or equal to one month
      return timeDiff >= oneMonthInMillis;
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      <div className="dashboard-content-wrapper">
        <div className="dash-row">
          <div className="dashboard-small-card">
            <div className="">
              <h5>INR {dataList?.netPNL?.toFixed(2)}</h5>
              <h6>Net PNL</h6>
            </div>
          </div>
          <div className="dashboard-small-card">
            <div className="">
              <h5>INR {dataList?.avgReturnPerDay?.toFixed(2)}</h5>
              <h6>Avg Return/Day</h6>
            </div>
          </div>
          <div className="dashboard-small-card">
            <div className="">
              <h5>&nbsp;
                {dataList?.karmaFactor && dataList?.karmaFactor[0]?.toFixed(2)}
              </h5>
              <h6>Karma Factor</h6>
            </div>
          </div>
          <div className="dashboard-small-card">
            <div className="">
              <h5>INR {dataList?.maxDD?.toFixed(2)}</h5>
              <h6>Max DD</h6>
            </div>
          </div>
        </div>
        <div className="dash-row mt-5">
          <div className="dashboard-small-card">
            <div className="">
              <h5>&nbsp;{dataList?.winPercentage?.toFixed(2)}%</h5>
              <h6>Win %</h6>
            </div>
          </div>
          <div className="dashboard-small-card">
            <div className="">
              <h5>&nbsp;{dataList?.RRratio?.toFixed(2)}</h5>
              <h6>R:R ratio</h6>
            </div>
          </div>
          <div className="dashboard-small-card">
            <div className="">
              <h5>&nbsp;{dataList?.avgWinningTrade?.toFixed(2)}</h5>
              <h6>Average winning trade</h6>
            </div>
          </div>
          <div className="dashboard-small-card">
            <div className="">
              <h5>&nbsp;{dataList?.avgLosingTrade?.toFixed(2)}</h5>
              <h6>Average losing trade</h6>
            </div>
          </div>
        </div>

        <div className="row mt-5 main-card-wrap">
          <div className="col-md-6 col-12 ">
            <div className="insights-card chat-card list-box">
              <h6>Insights</h6>
              <ul
                id="arrow-list"
                style={{ overflowY: "auto", height: "400px" }}
              >
                <li>
                  {dataList?.netPNL?.toFixed(2)
                    ? insightsData[0]
                    : insightsData[1]}
                  {/* It is a long established fact that a reader will be distracted by the readable. */}
                </li>
                <li>
                  {dataList?.karmaFactor &&
                  dataList?.karmaFactor[1] < 4 * dataList.karmaFactor[2]
                    ? insightsData[2]
                    : insightsData[3]}
                  {/* It is a long established fact that a reader will be distracted by the readable. */}
                </li>
                <li>
                  {dataList?.maxDD?.toFixed(2) > 25
                    ? insightsData[4]
                    : insightsData[5]}
                  {/* It is a long established fact that a reader will be distracted by the readable. */}
                </li>
                <li>
                  {dataList?.winPercentage > 50 && dataList?.netPNL > 0
                    ? insightsData[6]
                    : dataList?.winPercentage > 50 && dataList?.netPNL < 0
                    ? insightsData[7]
                    : dataList?.winPercentage < 50 && dataList?.netPNL > 0
                    ? insightsData[8]
                    : insightsData[9]}
                  {/* It is a long established fact that a reader will be distracted
                  by the readable. */}
                </li>
                <li>
                  {dataList?.RRratio < 0.5
                    ? insightsData[10]
                    : insightsData[11]}
                  {/* It is a long established fact that a reader will be distracted*/}
                </li>
                <li>
                  {(!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    dataList?.totalTradeCharges >=
                      0.8 * dataList?.openingBalance) ||
                  (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    dataList?.totalTradeCharges >=
                      0.8 * dataList?.openingBalance)
                    ? insightsData[12]
                    : (!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                        dataList?.totalTradeCharges <
                          0.8 * dataList?.openingBalance) ||
                      (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                        dataList?.totalTradeCharges <
                          0.8 * dataList?.openingBalance)
                    ? insightsData[13]
                    : insightsData[14]}
                  {/* It is a long established fact that a reader will be distracted*/}
                </li>
                <li>
                  {(!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    dataList?.totalTradePenalties >=
                      0.2 * dataList?.openingBalance) ||
                  (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    dataList?.totalTradePenalties >=
                      0.2 * dataList?.openingBalance)
                    ? insightsData[15]
                    : (!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                        dataList?.totalTradePenalties <
                          0.2 * dataList?.openingBalance) ||
                      (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                        dataList?.totalTradePenalties <
                          0.2 * dataList?.openingBalance)
                    ? insightsData[16]
                    : insightsData[17]}
                  {/* It is a long established fact that a reader will be distracted*/}
                </li>
                {dataList?.convictionType === "Low" && dataList?.netPNL < 0 ? (
                  <li> {insightsData[18]}</li>
                ) : dataList?.convictionType === "Medium" &&
                  dataList?.netPNL < 0 ? (
                  <li> {insightsData[19]}</li>
                ) : (
                  dataList?.convictionType === "High" &&
                  dataList?.netPNL < 0 && <li>{insightsData[20]}</li>
                )}
                <li>
                  {dataList?.topFivePercentAccountLessThanZero
                    ? insightsData[21]
                    : insightsData[22]}
                  {/* It is a long established fact that a reader will be distracted*/}
                </li>
                {(!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                  dataList?.totalSlippage >= 1 * dataList?.openingBalance) ||
                (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                  dataList?.totalSlippage >= 1 * dataList?.openingBalance) ? (
                  <li>{insightsData[23]}</li>
                ) : (
                  (!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    dataList?.totalSlippage < 1 * dataList?.openingBalance) ||
                  (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    dataList?.totalSlippage < 1 * dataList?.openingBalance && (
                      <li>{insightsData[24]}</li>
                    ))
                )}
                {(!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                  dataList?.isNetROI3Percent) ||
                (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                  dataList?.isNetROI3Percent) ? (
                  <li>{insightsData[25]}</li>
                ) : (
                  (!isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    !dataList?.isNetROI3Percent) ||
                  (isOneMonthGap(dataList?.startDate, dataList?.endDate) &&
                    dataList?.isNetROI3Percent && <li>{insightsData[26]}</li>)
                )}
                {dataList?.maxConsecutiveLosses >= 10 && (
                  <li>{insightsData[27]}</li>
                )}
              </ul>
            </div>
          </div>
          <div className="col-md-6 col-12 chat-card">
            <Card>
              {/* <Card.Header>Equity Curve</Card.Header> */}
              <p>Equity Curve</p>
              <div className="card-body">
                <CurveChart dataList={dataList} />
              </div>
            </Card>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-6 col-12 chat-card">
            <Card>
              <p>Strategy Performance</p>
              {/* <Card.Header>Strategy Performance</Card.Header> */}
              <div className="card-body">
                <GroupedBarChart dataList={dataList} />
              </div>
              {/* <div className="card-body"><BarChart dataList={dataList} /></div> */}
            </Card>
          </div>
          <div className="col-md-6 col-12 chat-card">
            <Card>
              <p>Daily PNL</p>
              {/* <Card.Header>Daily PNL</Card.Header> */}
              <div className="card-body">
                <DailyPnlChart dataList={dataList} />
              </div>
              {/* <div className="card-body"><BarChart dataList={dataList} /></div> */}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
