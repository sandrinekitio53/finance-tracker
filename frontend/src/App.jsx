import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './component/authen/login';
import Signup from './component/authen/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import Budget from './pages/budget/budget';
import Transactions from './pages/transactions/transaction';
import Account from './pages/account/account';
import Analytics from './pages/analytics/analytic';
import Mainlayout from './pages/mainlayout/mainlayout';
import Goals from './pages/goals/goal';

const App = () => {
// check the memory first 
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'; // localstorage is used so as not to go to the login page once the page is refreshed 
  });

  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('userData'); // store the user's info and preference 
    return savedUser ? JSON.parse(savedUser) : {
      firstName: "",
      lastName: "",
      email: "",
      userInitial: "",
      profilePic: null
    };
  });

  //  SUCCESS HANDLER: Now saves to memory
  const handleLoginSuccess = (data) => {
    const dataWithInitial = {
      ...data,
      userInitial: data.firstName ? data.firstName.charAt(0).toUpperCase() : 'U'
    };
    
    // Save to LocalStorage so refresh doesn't break it
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(dataWithInitial));
    
    setIsAuthenticated(true);
    setUserData(dataWithInitial);
    console.log("Login Success - Data Saved:", dataWithInitial);
  };
  
  //  LOGOUT HANDLER to Clear the  memory
   // this one handles the logout and i paased as prop in the sidebar and mainlayout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData({ firstName: "", lastName: "", email: "", userInitial: "", profilePic: null });
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={isAuthenticated ? <Navigate to="/owner/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/owner/dashboard" replace /> : <Signup onLoginSuccess={handleLoginSuccess} />} />

      <Route path="/owner" element={isAuthenticated ? <Mainlayout user={userData} onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
        <Route path="dashboard" element={<Dashboard user={userData} />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="goals" element={<Goals />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="account" element={<Account />} />
      </Route>
        
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default App;