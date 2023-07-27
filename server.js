const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(cors());
app.use(express.js on());

// server.js
const messagesRoute = require('./routes/messages');
app.use('/api/messages', messagesRoute);

const mongodbUri = 'mongodb+srv://Biswas:Biswas@cluster0.o4yg4ob.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URI

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
  socket.on('newMessage', (newMessage) => {
    // Save the new message to the database (similar to what we did in the POST route)

    // Broadcast the new message to all connected clients
    socket.broadcast.emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 5000; // You can use any available port you prefer
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
