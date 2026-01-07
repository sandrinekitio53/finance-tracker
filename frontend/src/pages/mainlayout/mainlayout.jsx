import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import './main.css';
import { Icons } from '../../assets/assets';


const Mainlayout = ({user, onLogout }) => {

  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";
  const email = user?.email || "No email provided";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="layout-container">
      <Sidebar onLogout={onLogout} />

      <div className="content-wrapper">
        <header className="content-header">
          
          <div className="header-welcome">
            <h1 className="title">Welcome, {firstName}</h1>
            <p className="subtitle">Here's what's happening with your money today.</p>
          </div>

          <div className="header-actions">
            
            <div className="search-bar">
              <Icons.Search className="icons" />
              <input type="text" placeholder="Search..." />
            </div>

            <button className="icon-btn">
              <Icons.Notification className="icons" />
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile-box">
              <div className="profile-pic">
            {/* If there is a photo, show it. Otherwise, show the Initial */}
            {user?.profilePic ? (
              <img src={user.profilePic} alt="profile" className="profile-img" />
            ) : (
              initial
            )}
          </div>
              <div className="user-info ">
                <span className="user-name">{firstName} {lastName}</span>
                <span className="user-email">{email}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-display">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Mainlayout;
