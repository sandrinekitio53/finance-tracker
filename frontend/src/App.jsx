import React from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';


import Login from './component/authen/login';
import Signup from './component/authen/SignUp';
import Dashboard from './component/authen/dashboard/Dashboard';



const App = () => {
  // 1. Placeholder for authentication state
  // In a real app, this would be managed by Context/Redux and updated on successful login/logout.
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); 

  // Function to be called from LoginForm upon successful backend login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  return (
 
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={isAuthenticated ? (<Navigate to="/owner" replace />) : (<Login onLoginSuccess={handleLoginSuccess} />)}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/owner" element={isAuthenticated ? (<Dashboard />) : (<Navigate to="/login" replace />)}/>
        
        {/* Catch-all route for 404s */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
   
  );
};

export default App;