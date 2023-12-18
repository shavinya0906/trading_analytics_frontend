import { Nav } from "react-bootstrap";
import "./Sidebar.scss";
import { useState } from "react";
import Logo from "../../assets/images/logo.png";
import HomeLogo from "../../assets/images/menulogo/Home.svg";
import ChartLogo from "../../assets/images/menulogo/Chart 2.svg";
import pennewSquer from "../../assets/images/menulogo/Pen New Square.svg";
import RoundGraph from "../../assets/images/menulogo/Round Graph.svg";
import SidebarLogo from "../../assets/images/menulogo/Siderbar.svg";
import SettingLogo from "../../assets/images/menulogo/Setting.svg";
import ActivityLogo from "../../assets/images/menulogo/Activity.svg";

const Sidebar = ({ state, setState }) => {
  const toggleNavbar = () => {
    setState({
      collapsed: !state.collapsed,
    });
  };
  return (
    <div
      className="side-wrapper"
      onMouseEnter={toggleNavbar}
      onMouseLeave={toggleNavbar}
    >
      <div className={`sidebar ${state?.collapsed ? "is-open" : "is-close"}`}>
        <Nav className="sidebar-header">
          <Nav.Item>
            <Nav.Link href="/">
              <img src={Logo} alt="Logo" />
              {state?.collapsed ? (
                <span className="text-light nav-items">TradeAnalytics</span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="sidebar-header">
          <Nav.Item>
            <Nav.Link href="/">
              <img src={HomeLogo} alt="Logo" />
              {state?.collapsed ? (
                <span className="text-light nav-items ms-2">Dashboard</span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="sidebar-header">
          <Nav.Item>
            <Nav.Link href="/tradelog">
              <img src={pennewSquer} alt="Logo" />
              {state?.collapsed ? (
                <span className="text-light nav-items ms-2">Trade log</span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="sidebar-header ">
          <Nav.Item>
            <Nav.Link href="/trader-analytics">
              <img src={ActivityLogo} alt="Logo" />
              {state?.collapsed ? (
                <span className="text-light nav-items ms-2">
                  Trade Analytics
                </span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="sidebar-header ">
          <Nav.Item>
            <Nav.Link href="/trading-accounts">
          <img src={ChartLogo} alt="Logo" />
          {state?.collapsed ? (
            <span className="text-light nav-items ms-2">Trading Accounts</span>
          ) : (
            ""
          )}
          </Nav.Link>
        </Nav.Item>
        </Nav>
        <Nav className="sidebar-header">
          <Nav.Item>
            <Nav.Link href="/strategies">
          <img src={RoundGraph} alt="Logo" />
          {state?.collapsed ? (
            <span className="text-light nav-items ms-2">Strategies</span>
          ) : (
            ""
          )}
          </Nav.Link>
        </Nav.Item>
        </Nav>
        <Nav className="sidebar-header">
          <img src={SidebarLogo} alt="Logo" />
          {state?.collapsed ? (
            <span className="text-light nav-items ms-2">Calculator</span>
          ) : (
            ""
          )}
        </Nav>
        <Nav className="sidebar-header">
          <img src={SettingLogo} alt="Logo" />
          {state?.collapsed ? (
            <span className="text-light nav-items ms-2">Tools</span>
          ) : (
            ""
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
