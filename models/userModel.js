const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Hosteller', 'Hostellite', 'Admin'], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;