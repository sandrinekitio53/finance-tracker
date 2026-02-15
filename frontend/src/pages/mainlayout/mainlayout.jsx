import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import "./main.css";

// user={userData}  inthe app.jsx
const Mainlayout = ({ onLogout }) => {
 
  return (
    <div className="layout-container">
      <Sidebar onLogout={onLogout} />
      
        {/* the page to be disaplayed under the bar */}
        <main className="page-display">
          <Outlet />
        </main>
    </div>
  );
};

export default Mainlayout;
