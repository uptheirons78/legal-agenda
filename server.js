const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Port Definition
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Example of Get Response
app.get('/', (req, res) => {
  res.json({ msg: 'Hi there PostMan!' });
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// Listen the Server
app.listen(PORT, () => {
  console.log(`Server is correctly running on PORT ${PORT}`);
});
