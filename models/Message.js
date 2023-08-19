const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    // A roomId is composed of two userIds separated by a hyphen
    // The smaller userId comes first
    match: /^[0-9]+-[0-9]+$/
  },
  message: {
    type: String,
    required: true,
    // A message cannot be empty
    minlength: 1
  },
  name: {
    type: String,
    required: true,
    // A name is the username of the sender
  },
  timestamp: {
    type: Date,
    required: true,
    // A timestamp is the date and time when the message was sent
  }
});

module.exports = mongoose.model('Message', messageSchema);

