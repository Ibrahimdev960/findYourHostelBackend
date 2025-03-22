const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  amenities: { type: [String], required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;