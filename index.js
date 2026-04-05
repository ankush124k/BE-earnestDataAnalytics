require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running', version: '1.0.0' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Server startup
const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the process using port ${PORT} or set a different PORT in .env.`);
    process.exit(1);
  }
  throw error;
});

module.exports = app;
