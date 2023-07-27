// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages for a specific chat room
router.get('/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await Message.find({ roomId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { roomId, message, name, timestamp, received } = req.body;
    const newMessage = new Message({ roomId, message, name, timestamp, received });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

module.exports = router;