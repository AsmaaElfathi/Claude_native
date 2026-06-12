const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookingRoutes = require('./routes/bookings');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Booking Service is running');
});

const port = process.env.PORT || 3003;
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo:27017/booking-db';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB for Booking Service');
    app.listen(port, () => {
      console.log(`Booking Service listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Booking Service MongoDB connection error:', err);
  });
