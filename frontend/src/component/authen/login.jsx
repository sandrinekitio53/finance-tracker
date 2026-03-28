
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

function Login({ onLoginSuccess }) {
  const LOGIN_API_URL = 'http://localhost:8081/api-login';
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  try {
    const response = await axios.post(LOGIN_API_URL, { email, password });
    console.log('Login successful!', response.data);
    onLoginSuccess(response.data); 
    navigate('/owner/dashboard'); 

  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Invalid email or password.';
    setError(errorMsg);
    console.error('Login Error:', errorMsg);
  }
};
  return (
    <div className="container">
          <form onSubmit={handleSubmit}>
      <h2>User  <span id="login-head">Login</span> </h2>
      {error && <p className='error'>{error}</p>}

      <div className='l1'>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      </div>

      <div className='l1'>
        <label htmlFor="password">Password</label>
        <div className="passwordInputWrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            placeholder="Enter password"
          />
          <button
            type="button"
            className="passwordToggleBtn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button className ="logBtn" type="submit">Log In</button>
      <p className='p-option'>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </form>
    </div>

  );
}

export default Login;
  // 1. Placeholder for authentication state
  // In a real app, this would be managed by Context/Redux and updated on successful login/logout.
//  Update the 'password', email  state on every change when using the onchange

  // Function to be called from LoginForm upon successful backend login