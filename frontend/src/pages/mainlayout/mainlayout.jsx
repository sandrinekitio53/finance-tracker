import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import "./main.css";

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
// Outlet is that react-router-dom elt that provides access to diff pages. 
// ie it acts like a window where the diff pages are found 
// onlogout is passed as a prop from the app.jsx
