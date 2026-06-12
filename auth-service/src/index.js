const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('Auth Service running'));

const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/auth-db';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Auth Service listening on port ${port}`)))
  .catch((err) => console.error('Auth Service MongoDB connection error:', err));
