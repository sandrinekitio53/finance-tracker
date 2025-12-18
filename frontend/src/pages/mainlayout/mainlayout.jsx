import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import './main.css';

const Mainlayout = ({ onLogout }) => {
  return (
    <div className="layout-container">
      {/* The Sidebar (Left side) */}
      <Sidebar onLogout={onLogout} />

      {/* The Content Area (Right side) */}
      <div className="content-wrapper">
        {/* <header className="content-header">
          <h2 style={{ color: '#64748b' }}>User Dashboard</h2>
          <div className="user-avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#B0E0E6' }}></div>
        </header> */}

        <main className="page-display">
          <Outlet /> {/* <-- Pages like Dashboard.jsx appear here */}
        </main>
      </div>
    </div>
  );
};

export default Mainlayout;
