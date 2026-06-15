const express = require('express');
const { publishEvent } = require('../services/rabbitmq');
const Room = require('../models/Room');

const router = express.Router();

router.post('/confirm', async (req, res) => {
  const { roomId, customerName } = req.body;
  if (!roomId) return res.status(400).json({ message: 'roomId is required' });

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const event = {
    roomId,
    customerName: customerName || 'anonymous',
    status: 'confirmed',
    timestamp: new Date().toISOString()
  };

  await publishEvent('booking.confirmed', event);
  res.status(200).json({ message: 'Booking confirmed event published', event });
});

router.post('/cancel', async (req, res) => {
  const { roomId, customerName, reason } = req.body;
  if (!roomId) return res.status(400).json({ message: 'roomId is required' });

  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const event = {
    roomId,
    customerName: customerName || 'anonymous',
    status: 'cancelled',
    reason: reason || 'not specified',
    timestamp: new Date().toISOString()
  };

  await publishEvent('booking.cancelled', event);
  res.status(200).json({ message: 'Booking cancelled event published', event });
});

module.exports = router;
