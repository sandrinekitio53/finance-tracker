const express = require('express');
const cors = require('cors');
// to import the db module created 
const db = require('./db'); 

const app = express();
app.use(cors()); 
app.use(express.json());
 const PORT = 8081;

app.post('/api-register', async (req, res) => {
  
  const { firstName, lastName, email, password } = req.body;

  const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
  const values = [firstName, lastName, email, password];
  
  try {
    await db.execute(sql, values);
    res.status(201).json({ 
        message: 'User registered successfully!', 
        user: { firstName, lastName, email } 
    });
  } catch (error) {
    console.error('MySQL Error during registration:', error);
    res.status(500).json({ 
        message: 'Registration failed. Email might already be in use.', 
        error: error.message 
    });
  }
});


app.post('/api-login', async (req, res) => {
  const { email, password } = req.body;
  
const sql = 'SELECT id, first_name, last_name, email, password FROM users WHERE email = ?';

  try {
    const [rows] = await db.execute(sql, [email]); 
    const user = rows[0]; 

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (password === user.password) {      // pass this data here from the dbso as to send it to the app.jsx
      return res.status(200).json({ 
        message: 'Login successful!', 
        token: 'example_jwt_token_12345',
        firstName: user.first_name,  // pulls the data from the db
        lastName: user.last_name,
        email: user.email
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('MySQL Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});


// once the app liste to this port num  means the connection was well done
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS configured for React at http://localhost:3000`);
});