const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const roomsRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/health', (req, res) => res.json({ status: 'resource-service healthy' }));

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/resourcedb';
const port = process.env.PORT || 3002;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Resource service connected to MongoDB');
    app.listen(port, () => console.log(`Resource service listening on port ${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
