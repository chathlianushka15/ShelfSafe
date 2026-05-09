const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser'); 

const app = express();

// Template Engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: 'shelfsafe-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shelfsafe')  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ShelfSafe Backend is running!' });
});

// EJS status page
app.get('/status', (req, res) => {
  res.render('status', {
    status: '✅ Running',
    env: 'development',
    uptime: Math.floor(process.uptime()),
    time: new Date().toLocaleString()
  });
}); 

// Session test route
app.get('/session-test', (req, res) => {
  if (req.session.visits) {
    req.session.visits++;
  } else {
    req.session.visits = 1;
  }
  res.json({
    message: 'Session is working!',
    visits: req.session.visits,
    sessionId: req.sessionID
  });
}); 

// Routes
const authMiddleware = require('./middleware/auth');
const itemRoutes = require('./routes/items');
app.use('/api/items', authMiddleware, itemRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    status: err.status || 500
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});