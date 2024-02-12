const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mock user data
const users = [
  { id: 1, username: 'user1@example.com', password: 'Password1$' },
  { id: 2, username: 'user2@example.com', password: 'Password2$' }
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find(user => user.username === username);

  // If user not found or password doesn't match, return error
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // If credentials are valid, return success
  res.json({ message: 'Login successful', user });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});