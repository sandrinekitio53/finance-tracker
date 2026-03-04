const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const session = require('express-session'); 

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// set limit for pic upload
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

app.use(session({
    secret: 'finance_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

const PORT = 8081;

// --- --------AUTHENTICATION  ROUTES---------

app.get('/api-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/api-register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const sqlInsert = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';

    try {
        const [result] = await db.execute(sqlInsert, [firstName, lastName, email, password]);
        const newUser = { id: result.insertId, firstName, lastName, email };
//    auto-loggin after signup
        req.session.user = newUser;

        return res.status(201).json({
            message: 'Account created and logged in successfully!',
            user: newUser
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'This email is already registered.' });
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

app.post('/api-login', async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT id, first_name, last_name, email, password FROM users WHERE email = ?';

    try {
        const [rows] = await db.execute(sql, [email]); 
        const user = rows[0]; 

        if (!user || password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        req.session.user = { 
            id: user.id, 
            firstName: user.first_name, 
            lastName: user.last_name, 
            email: user.email 
        };

        return res.status(200).json(req.session.user);
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});

app.post('/api-logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res.status(500).json({ error: "Could not log out." });
        }
        
        // Clear the browser cookie 
        res.clearCookie('connect.sid'); 
        res.status(200).json({ message: "Session Terminated" });
    });
});

app.put('/api-update-profile/:id', async (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email, bio, profilePic, profileBgColor } = req.body;

    const sql = `
        UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, bio = ?, profile_pic = ?, profile_bg_color = ?
        WHERE id = ?
    `;

    try {
        await db.execute(sql, [
            firstName, 
            lastName, 
            email, 
            bio || null, 
            profilePic || null, 
            profileBgColor || '#ffffff', 
            userId
        ]);

        // get the user from the DB 
        const [rows] = await db.execute(
            "SELECT id, first_name, last_name, email, profile_pic, profile_bg_color FROM users WHERE id = ?",
            [userId]
        );

        const updatedUser = {
            id: rows[0].id,
            firstName: rows[0].first_name,
            lastName: rows[0].last_name,
            email: rows[0].email,
            profilePic: rows[0].profile_pic,
            profileBgColor: rows[0].profile_bg_color
        };

        req.session.user = updatedUser;

        req.session.save(err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Session failed" });
            }

            return res.status(200).json(updatedUser);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api-user/current', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).send("Not authenticated");
    }
});

// --- --------------------TRANSACTION ROUTES --------------------------------
app.get('/api-transactions/:userId', async (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';
    try {
        const [rows] = await db.execute(sql, [userId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving your transactions.' });
    }
});

app.post('/api-add-transaction', async (req, res) => {
    const { user_id, amount, type, category, status, method, date, title } = req.body;

    const sql = `INSERT INTO transactions (user_id, amount, type, category, status, method, date, title) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        await db.execute(sql, [
            user_id, 
            amount, 
            type, 
            category, 
            status || 'Complete', 
            method, 
            date, 
            title || category // If title is missing, use category as the title
        ]);
        res.status(201).json({ message: 'Transaction saved!' });
    } catch (error) {
        console.error("❌ SQL Insert Error:", error.message);
        res.status(500).json({ message: 'Failed to save transaction.', error: error.message });
    }
});

app.delete('/api-delete-transaction/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM transactions WHERE id = ?';
    try {
        await db.execute(sql, [id]);
        res.status(200).json({ message: 'Deleted!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.put('/api-update-transaction/:id', async (req, res) => {
    const { id } = req.params;
    const { title, amount, type, category, method, status, date } = req.body;

    const sql = `UPDATE transactions SET title = ?, amount = ?, type = ?, category = ?, method = ?, status = ?, date = ? WHERE id = ?`;

    try {
        await db.execute(sql, [title, amount, type, category, method, status, date, id]);
        res.status(200).json({ message: "Transaction updated!" });
    } catch (error) {
        console.error("❌ SQL Update Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

//   ----------------------------------GOAL ROUTES -----------------------------------

// POST: Create a new Savings Goal
app.post('/api-goals/add', async (req, res) => {
    const { userId, title, amount, saved, date } = req.body;

    if (!userId) {
        console.error("CRITICAL: Received a goal request with no userId!");
        return res.status(400).json({ error: "User ID is required to save a goal." });
    }

    const sql = `INSERT INTO goals (user_id, title, target_amount, current_saved, target_date) VALUES (?, ?, ?, ?, ?)`;
    
    try {
        await db.execute(sql, [userId, title, amount, saved, date]);
        res.status(201).json({ message: "Goal saved!" });
    } catch (error) {
        console.error("DB Error:", error.message);
        res.status(500).json({ error: "Database failed" });
    }
});
// GET: Needed for Goals.jsx to display the list
app.get('/api-goals/:userId', async (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM goals WHERE user_id = ? ORDER BY target_date ASC";
    
    try {
        const [rows] = await db.execute(sql, [userId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch goals" });
    }
});
// DELETE Goal
app.delete('/api-goals/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute("DELETE FROM goals WHERE id = ?", [id]);
        res.status(200).json({ message: "Goal Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE ROUTE 
app.put('/api-goals/update/:id', async (req, res) => {
    const { id } = req.params;
    //  Use the property names you are sending from goalData in React
    const { title, amount, saved, date } = req.body; 

    try {
        const sql = `
            UPDATE goals 
            SET title = ?, target_amount = ?, current_saved = ?, target_date = ? 
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [title, amount, saved, date, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Goal not found in database" });
        }

        res.status(200).json({ message: "Goal updated successfully" });
    } catch (err) {
        console.error("Database Update Error:", err);
        res.status(500).json({ error: "Failed to update XAMPP vault" });
    }
});

//  ------------BUDGET ROUTES ----------------------
// GET Budgets: Joins with Transactions table to calculate spent amount on-the-fly
app.get('/api/budgets/:userId/:month', async (req, res) => {
    const { userId, month } = req.params;

    const sql = `
        SELECT 
            b.*, 
            COALESCE(SUM(t.amount), 0) as spent
        FROM budgets b
        LEFT JOIN transactions t ON 
            b.user_id = t.user_id AND 
            b.category = t.category AND 
            t.type = 'expense' AND 
            DATE_FORMAT(t.date, '%Y-%m') = ?
        WHERE b.user_id = ? AND b.month = ?
        GROUP BY b.id`;

    try {
        const [rows] = await db.execute(sql, [month, userId, month]);
        res.json(rows);
    } catch (err) {
        console.error("Budget Fetch SQL Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// POST: Add or Update
app.post('/api/add-budget', async (req, res) => {
  const { userId, category, limitAmount, month } = req.body; // shld match your frontend names
  
  const sql = `
    INSERT INTO budgets (user_id, category, limit_amount, month) 
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE limit_amount = VALUES(limit_amount)`;
    
  try {
    const [result] = await db.execute(sql, [userId, category, limitAmount, month]);
    res.status(200).json({ message: "Success", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE
app.delete('/api/delete-budget/:id', async (req, res) => {
  await db.execute('DELETE FROM budgets WHERE id = ?', [req.params.id]);
  res.sendStatus(200);
});
// ----------------------------ACCOUNT ROUTE-----------------------------
// --- for password Update Node --- but isnot yet fxnal so check it out 
app.put('/api-update-password/:id', (req, res) => {
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const sql = "UPDATE users SET password = ? WHERE id = ?";
    
    db.query(sql, [newPassword, userId], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Vault synchronization failed." });
        }
        
        console.log(`User ${userId} password updated successfully.`);
        res.status(200).json({ message: "Security protocol updated!" });
    });
});