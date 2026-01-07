
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

function Login({ onLoginSuccess }) {
  const LOGIN_API_URL = 'http://localhost:8081/api-login';
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

//   const userData = {
//   firstName: fNameInput, // Value from your input field
//   lastName: lNameInput,
//   email: emailInput,
//   profilePic: null       // Since they just signed up, they won't have one yet
// };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
   
      const response = await axios.post(LOGIN_API_URL, { email, password });
      
      // Assuming a successful response means the credentials matched the XAMPP/MySQL data
      console.log('Login successful!', response.data);

      // 3. Call the success function passed from App.jsx
      onLoginSuccess(); 
      
      // 4. Navigate to the protected dashboard
      // The Navigate component in App.jsx will handle the final redirect to /owner, 
      // but this is the trigger.
      navigate('/owner'); 

    } catch (err) {
      // Handle login failure (e.g., invalid email/password from the server)
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
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button type="submit">Log In</button>
      <p className='p-option'>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </form>
    </div>

  );
}

export default Login;
//  Update the 'password' email  state on every change when using the onchange