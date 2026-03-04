import React from 'react'

import { Link, useLocation } from 'react-router-dom';
import { Icons, SidebarLinks } from '../../assets/assets';
import './sidebar.css'

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebarHeader">logo-image FinanceTracker</div>
      
      <nav className="navMenu">
        {SidebarLinks.map((link) => {          
          return (
            <Link key={link.id} to={link.path} className={location.pathname === link.path ? "nav-item active" : "nav-item"}>
              <span className="nav-icon">
                <link.icon />
              </span>
              
              <span className="nav-text">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={onLogout} className="logout-button">
        <Icons.Logout size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
// useLocation, location.pathname is like a GPS  of the app i.e looking for a page based on the pathname and it will take u there directly
// the nav-item is like the UNIFORM that every set of my LINKS have on . so any styling made shld be done on the nav-item