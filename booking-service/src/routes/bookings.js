const express = require('express');
const Booking = require('../models/Booking');
const amqp = require('amqplib');
const dotenv = require('dotenv');
const authenticateToken = require('../middleware/auth');

dotenv.config();

const router = express.Router();

const bookingCostPerHour = 30;

async function publishNotification(event, data) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'booking.confirmed';
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ event, data })), { persistent: true });
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Booking service publish error:', error);
  }
}

function calculateTotalCost(startDate, endDate) {
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
  return durationHours * bookingCostPerHour;
}

router.post('/', authenticateToken, async (req, res) => {
  const { roomId, startDate, endDate } = req.body;
  const userId = req.user.userId;

  if (!roomId || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing required booking properties' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) {
    return res.status(400).json({ message: 'End date must be after start date' });
  }

  const conflict = await Booking.findOne({
    roomId,
    status: 'confirmed',
    $or: [
      { startDate: { $lt: end }, endDate: { $gt: start } },
    ],
  });

  if (conflict) {
    return res.status(409).json({ message: 'Room is already booked for this timeframe' });
  }

  const totalCost = calculateTotalCost(start, end);

  const booking = new Booking({
    roomId,
    userId,
    startDate: start,
    endDate: end,
    totalCost,
    status: 'confirmed'
  });

  await booking.save();
  publishNotification('booking.confirmed', booking);

  res.status(201).json(booking);
});

router.get('/', authenticateToken, async (req, res) => {
  const { roomId } = req.query;
  const filter = { userId: req.user.userId };
  if (roomId) filter.roomId = roomId;
  const bookings = await Booking.find(filter).sort({ createdAt: -1 });
  res.json(bookings);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.userId !== req.user.userId) {
    return res.status(403).json({ message: 'You are not allowed to cancel this booking' });
  }

  booking.status = 'cancelled';
  await booking.save();
  res.json({ message: 'Booking cancelled', booking });
});

module.exports = router;
