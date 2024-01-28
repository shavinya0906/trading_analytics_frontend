import { Nav } from "react-bootstrap";
import "./Sidebar.scss";
import { useState } from "react";
import Logo from "../../assets/images/tradeJournalLogo.svg";
import HomeLogo from "../../assets/images/menulogo/Home.svg";
import ChartLogo from "../../assets/images/menulogo/Chart 2.svg";
import pennewSquer from "../../assets/images/menulogo/Pen New Square.svg";
import RoundGraph from "../../assets/images/menulogo/Round Graph.svg";
import SidebarLogo from "../../assets/images/menulogo/Siderbar.svg";
import SettingLogo from "../../assets/images/menulogo/Setting.svg";
import ActivityLogo from "../../assets/images/menulogo/Activity.svg";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ state, setState }) => {
  const navigate = useNavigate();
  const handleNavigate = (route) => {
    navigate(route);
  };
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
            <Nav.Link onClick={() => handleNavigate("/")}>
              <img src={Logo} alt="Logo" height={25} width={25} />
              {state?.collapsed ? (
                <span className="text-light nav-items">Trade Journal</span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="sidebar-header">
          <Nav.Item>
            <Nav.Link onClick={() => handleNavigate("/")}>
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
            <Nav.Link onClick={() => handleNavigate("/tradelog")}>
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
            <Nav.Link onClick={() => handleNavigate("/trader-analytics")}>
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
            <Nav.Link onClick={() => handleNavigate("/trading-accounts")}>
              <img src={ChartLogo} alt="Logo" />
              {state?.collapsed ? (
                <span className="text-light nav-items ms-2">
                  Trading Accounts
                </span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="sidebar-header">
          <Nav.Item>
            <Nav.Link onClick={() => handleNavigate("/strategies")}>
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
          <Nav.Item>
            <Nav.Link onClick={() => handleNavigate("/calculator")}>
              <img src={SidebarLogo} alt="Logo" />
              {state?.collapsed ? (
                <span className="text-light nav-items ms-2">Calculator</span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="sidebar-header">
          <Nav.Item>
            <Nav.Link onClick={() => handleNavigate("/tools")}>
              <img src={SettingLogo} alt="Logo" />
              {state?.collapsed ? (
                <span className="text-light nav-items ms-2">Tools</span>
              ) : (
                ""
              )}
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
