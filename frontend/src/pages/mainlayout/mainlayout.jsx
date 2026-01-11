import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import './main.css';
import { Icons } from '../../assets/assets';


const Mainlayout = ({user, onLogout }) => {
  const currentUser = user || {};

  const firstName = currentUser.firstName || "User";
  const lastName = currentUser.lastName || "";
  const email = currentUser.email || "No email provided";
  const initial = currentUser.userInitial ||firstName.charAt(0).toUpperCase();
  //  still need to implement the logic for this one to work and disaplay the letter of theuser if it hasnt yet uploaded the profile image.

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
            
            {/* <div className="search-bar">
              <Icons.Search className="icons" />
              <input type="text" placeholder="Search..." />
            </div> */}

            <button className="icon-btn">
              <Icons.Notification className="icons" />
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile-box">
              <div className="profile-pic">
            {/* If there is a photo, show it. Otherwise, show the Initial */}
            {currentUser.profilePic ? (
              <img src={currentUser.profilePic} alt="profile" className="profile-img" />
            ) : (
             <span className="initial-text">{initial}</span>
            )}
          </div>
              <div className="user-info ">
                <span className="user-name">{firstName} {lastName}</span>
                <span className="user-email">{email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* the page to be disaplayed under the bar */}
        <main className="page-display">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Mainlayout;
