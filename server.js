// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/message'); // Import the Message model

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(cors());
app.use(express.json());

const users = {};

// server.js
const messagesRoute = require('./routes/messages');
app.use('/api/messages', messagesRoute);

// Replace with your MongoDB URI
const mongodbUri = 'mongodb+srv://Biswas:Biswas@cluster0.o4yg4ob.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});


io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for new message events
  socket.on('newMessage', async (newMessage, recipientUserId) => { // Add async keyword and recipientUserId as an argument
    // Save the new message to the database (similar to what we did in the POST route)
    try {
      const { roomId, message, name, timestamp, received } = newMessage;
      const messageToSave = new Message({ roomId, message, name, timestamp, received });
      await messageToSave.save();
    } catch (error) {
      console.error('Error saving message:', error);
    }

    // Check if the recipient user is online (connected to the socket)
    if (users[recipientUserId]) {
      // Emit the new message event to the recipient user only
      users[recipientUserId].emit('newMessage', newMessage);
    }
  });

  // When a user logs in, store their socket in the users object
  socket.on('login', (userId) => {
    users[userId] = socket;
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    
    // Remove the user's socket from the users object when they disconnect
    Object.entries(users).forEach(([userId, userSocket]) => {
      if (userSocket === socket) {
        delete users[userId];
      }
    });
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
