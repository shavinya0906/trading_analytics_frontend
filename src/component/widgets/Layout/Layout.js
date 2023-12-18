import React from "react";
import "./Layout.scss"; // Import your CSS stylesheet for styling
import Sidebar from "../../sidebar/Sidebar";
import Header from "../../header/header";

function Layout({ children }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
      <div className="content-wrapper">
        <header className="header">
          <Header />
        </header>
        <main className="main-content">{children && children}</main>
      </div>
    </div>
  );
}

export default Layout;
