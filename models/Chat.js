// models\Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: Date,
});

module.exports = mongoose.model('Chat', ChatSchema);