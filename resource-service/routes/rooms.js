const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, description, status } = req.body;
  const room = new Room({ name, description, status });
  await room.save();
  res.status(201).json(room);
});

router.get('/', async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

router.get('/:id', async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
});

router.put('/:id', async (req, res) => {
  const { name, description, status } = req.body;
  const room = await Room.findByIdAndUpdate(req.params.id, { name, description, status }, { new: true, runValidators: true });
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
});

router.delete('/:id', async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json({ message: 'Room deleted' });
});

module.exports = router;
