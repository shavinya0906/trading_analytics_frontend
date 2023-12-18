import React, { useState } from "react";
import DashboardRouter from "../../routes/dashboardRoute";
import Sidebar from "../sidebar/Sidebar";
import { Container } from "react-bootstrap";

const Dashboard = () => {
  const [state, setState] = useState({ collapsed: false });
  return (
    <div className="page-wrapper">
      <Sidebar state={state} setState={setState} />
      <DashboardRouter state={state} />
    </div>
  );
};

export default Dashboard;
