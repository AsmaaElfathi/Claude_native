const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['available', 'maintenance'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
