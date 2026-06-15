const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.json({ status: 'auth-service healthy' }));

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/authdb';
const port = process.env.PORT || 3001;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Auth service connected to MongoDB');
    app.listen(port, () => console.log(`Auth service listening on port ${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
