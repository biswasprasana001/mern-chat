// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

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

const { initSocket } = require('./socket'); // Import the initSocket function

initSocket(server); // Initialize Socket.IO

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});