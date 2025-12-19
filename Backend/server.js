// server.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  console.log('GET / called');
  res.send('LMS Backend Running');
});

// Import routes
console.log('Loading routes...');
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth route loaded');
} catch (e) { console.error('❌ Auth error:', e.message); }

try {
  app.use('/api/books', require('./routes/books'));
  console.log('✅ Books route loaded');
} catch (e) { console.error('❌ Books error:', e.message); }

try {
  app.use('/api/members', require('./routes/members'));
  console.log('✅ Members route loaded');
} catch (e) { console.error('❌ Members error:', e.message); }

try {
  app.use('/api/issues', require('./routes/issues'));
  console.log('✅ Issues route loaded');
} catch (e) { console.error('❌ Issues error:', e.message); }

try {
  app.use('/api/dashboard', require('./routes/dashboard'));
  console.log('✅ Dashboard route loaded');
} catch (e) { console.error('❌ Dashboard error:', e.message); }

try {
  app.use('/api/reservations', require('./routes/reservations'));
  console.log('✅ Reservations route loaded');
} catch (e) { console.error('❌ Reservations error:', e.message); }


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// Start server and DB connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
