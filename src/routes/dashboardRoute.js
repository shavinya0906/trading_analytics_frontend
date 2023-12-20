import { Route, Routes } from "react-router-dom";
import TradeLog from "../component/tradeLog";
import Header from "../component/header/header";
import { Container } from "react-bootstrap";
import Home from "../component/home";
import Strategies from "../component/strategies/Strategies";
import TradingAccounts from "../component/tradingAccounts/TradingAccounts";
import TradeAnalytics from "../component/TradingAnalytics";
import Tools from "../component/tools"
import Calendar from "../component/calendar";

const DashboardRouter = ({ state }) => {
  return (
    <div
      className={`main-content-wrap ${
        state?.collapsed ? "is-open" : "is-close"
      }`}
    >
      <Container fluid className="content p-0">
        <Header />
        <Routes>
          <Route path="/tradelog" element={<TradeLog />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/trading-accounts" element={<TradingAccounts />} />
          <Route path="/trader-analytics" element={<TradeAnalytics />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/calendar" element={<Calendar />} />

          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </div>
  );
};

export default DashboardRouter;
