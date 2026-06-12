const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());

const rooms = [
  { id: 'room1', name: 'Salle 1', description: 'Salle de conférence', pricePerHour: 30 },
  { id: 'room2', name: 'Salle 2', description: 'Salle de formation', pricePerHour: 35 },
  { id: 'room3', name: 'Salle 3', description: 'Salle de réunion', pricePerHour: 40 }
];

app.get('/api/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/', (req, res) => res.send('Resource Service running'));

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Resource Service listening on port ${port}`));
