// models/message.js (lowercase)
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: String,
  name: String,
  received: Boolean,
}, { timestamps: true }); // Add timestamps option

module.exports = mongoose.model('Message', messageSchema);
