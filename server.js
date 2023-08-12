// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = require('http').createServer(app);
app.use(cors());
app.use(express.json());

const authRoute = require('./routes/auth');

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

// Use the authRoute
app.use('/api/user', authRoute);

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
