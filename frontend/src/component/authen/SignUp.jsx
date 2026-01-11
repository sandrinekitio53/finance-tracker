import React, { useState } from 'react';
import axios from 'axios'; // 1. Import axios
import { Link } from 'react-router-dom';
import './login.css';

// The URL where your backend server/API is running

const Signup = () => {
  const API_URL = 'http://localhost:8081/api-register'; 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); 

    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      // axios.post() is used to communicate with the backend
      const response = await axios.post(API_URL, userData);
      //  incase of success the 201 or 200 status will react
      setMessage(`Sign-up successful! Welcome ${response.data.user.firstName}!`);
      console.log('Backend response:', response.data);

      // Clear the form after successful submission
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');

    } catch (error) {
      
      if (error.response) {
        
        setMessage(`Error: ${error.response.data.message || 'Something went wrong on the server.'}`);
      } else if (error.request) {
        setMessage('Error: No response from the server. Check your backend connection.');
      } else {
        setMessage('Error during sign-up. Please try again.');
        console.error('Axios error:', error.message);
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
      <h2>User <span id="login-head">Sign-Up</span> </h2>
      
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green', border: '1px solid', padding: '10px' }}>{message}</p>}

      <div className='l1'>
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
      </div>

      <div className='l1'> 
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
      </div>
      
      <div className='l1'>
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
      </div>

      <div className='l1'>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
      </div>

      <button type="submit">Sign Up</button>
      <p className='p-option'>
        Already have an Account? <Link to="/login">Log In</Link>
      </p>
    </form>
    </div>
    
  );
}

export default Signup;