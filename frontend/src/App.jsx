import React from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';


import Login from './component/authen/login';
import Signup from './component/authen/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import Budget from './pages/budget/budget';
import Transactions from './pages/transactions/transaction';
import Account from './pages/account/account';
import Analytics from './pages/analytics/analytic';
import Goals from './pages/goals/goal';
import Mainlayout from './pages/mainlayout/mainlayout';




const App = () => {
  // 1. Placeholder for authentication state
  // In a real app, this would be managed by Context/Redux and updated on successful login/logout.
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); 

  // Function to be called from LoginForm upon successful backend login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  // this one handles the logout and i paased as prop in the sidebar and mainlayout
  const handleLogout = () => {
    setIsAuthenticated(false);   
  }

  return (
 
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={isAuthenticated ? (<Navigate to="/owner" replace />) : (<Login onLoginSuccess={handleLoginSuccess} />)}/>
        <Route path="/signup" element={<Signup />}/>


        {/* THE PROTECTED ROUTES SECTION */}
      <Route path="/owner" element={isAuthenticated ? <Mainlayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
        {/* These are "Child" routes. They render inside MainLayout's <Outlet /> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="goals" element={<Goals />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="account" element={<Account />} />
      </Route>
        
        {/* Catch-all route for 404s */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
   
  );
};

export default App;