// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message'); // Import the Message model
const { getIO } = require('../socket');
// Get all messages for a specific chat room
router.get('/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await Message.find({ roomId });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { roomId, message, name, timestamp } = req.body;
    const newMessage = new Message({ roomId, message, name, timestamp });
    await newMessage.save();
    const io = getIO(); // Get the socket instance
    io.to(roomId).emit('newMessage', newMessage); // Emit to the specific room
    console.log('Emitting newMessage:', newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
});

module.exports = router;
