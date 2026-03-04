import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Login from './component/authen/login';
import Signup from './component/authen/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import Budget from './pages/budget/budget';
import Transactions from './pages/transactions/transaction';
import Account from './pages/account/account';
import Analytics from './pages/analytics/analytic';
import Mainlayout from './pages/mainlayout/mainlayout';
import Goals from './pages/goals/goal';
import ProfilePage from './pages/dashboard/profilePage';
import LandingPage from './component/authen/landingPage/landing';



const App = () => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLoginSuccess = (data) => {
    const dataWithInitial = {
      ...data,
      userInitial: data.firstName ? data.firstName.charAt(0).toUpperCase() : 'U'
    };    
    setIsAuthenticated(true);
    setUserData(dataWithInitial);
    console.log("Session Active - User Loaded:", dataWithInitial);
  };
  
  useEffect(() => {
    const checkSession = async () => {
      try {
    
        const response = await axios.get('http://localhost:8081/api-session');
        
        if (response.data.loggedIn) {
          handleLoginSuccess(response.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // stpos loading only once the serever responds
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8081/api-logout');
      setIsAuthenticated(false);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

 const handleProfileUpdate = (newData) => {
  setUserData(prev => ({
    ...prev,
    ...newData,
    userInitial: newData.firstName
      ? newData.firstName.charAt(0).toUpperCase()
      : 'U'
  }));
  handleLoginSuccess(newData);
};  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" 
        element={isAuthenticated ? <Navigate to="/owner/dashboard" replace /> : <LandingPage />} 
      />
      <Route path="/login" 
        element={isAuthenticated ? <Navigate to="/owner/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
      />
      <Route path="/signup" 
        element={isAuthenticated ? <Navigate to="/owner/dashboard" replace /> : <Signup onLoginSuccess={handleLoginSuccess} />} 
      />
     {/* layouts accessible onlh once authenticated */}
      <Route path="/owner" element={isAuthenticated ? <Mainlayout user={userData} onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
        <Route path="dashboard" element={<Dashboard user={userData} />} />
        <Route path="profile" element={<ProfilePage user={userData} onUpdateUser={handleProfileUpdate} />} />
        <Route path="transactions" element={<Transactions user={userData} />} />
        <Route path="budget" element={<Budget user={userData}/>} />
        <Route path="goals" element={<Goals userId={userData?.id}/>} />
        <Route path="analytics" element={<Analytics user={userData}/>} />
        <Route path="account" element={<Account user={userData} onProfileUpdate={handleProfileUpdate}/>} />
      </Route>
        
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};

export default App;
    // Since axios.defaults.withCredentials = true is in main.jsx, 
        // this request automatically sends the session cookie. 