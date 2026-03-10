const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/shelfsafe')  .then(() => console.log('✅ MongoDB Connected!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ShelfSafe Backend is running!' });
});

// Routes
const authMiddleware = require('./middleware/auth');
const itemRoutes = require('./routes/items');
app.use('/api/items', authMiddleware, itemRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
