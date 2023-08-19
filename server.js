// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(express.json());
const io = socketIO(server);

app.use(cors({origin: 'http://localhost:3000'}));

const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);

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

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('newMessage', (newMessage) => {
    // Save the new message to the database

    io.to(newMessage.roomId).emit('updateMessages', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
