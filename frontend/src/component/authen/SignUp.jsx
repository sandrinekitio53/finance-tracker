import React, { useState } from 'react';
import axios from 'axios'; 
import { Link, useNavigate} from 'react-router-dom';
import './login.css';

const Signup = ({ onLoginSuccess }) => {
  const API_URL = 'http://localhost:8081/api-register'; // this Url is the server where the app is running on in the backend if i can say
  
  const navigate = useNavigate();
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
      const response = await axios.post(API_URL, userData,{ withCredentials: true });
      setMessage(`Sign-up successful! Welcome ${response.data.user.firstName}!`);
      console.log('Backend response:', response.data);
if (response.status === 201 || response.status === 200) {
        onLoginSuccess(response.data.user); 
        navigate('/owner/dashboard');
      }
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
// async(placed b4 the fxn), awaits(is placed inside an asyn fxn) and promises(is the axios.post or db.execute)
// promises is almost the same as the then and catch method which represnts the succes or failure os an async operation and its value. 
// promise is like a food odering in 03 steps 
// 1 u place an order(to initiate the async task)
// 2 the waiter gives u a promise (ticket)i.e u dont have food yet but u will have it (promise object)
// 3 in the bg, the kitcehn works on ur food (async runing the program so as to prevent freesing in the app)
// 4 while waiting do anything u wilsh to(ie continue suing the app to prevent any freezing the AWAIT)