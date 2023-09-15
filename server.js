// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

mongoose.connect('mongodb+srv://biswasprasana004:ksLWl8yWy2W5xt59@cluster0.vpsmj3b.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.error('Error occurred while connecting to the database:', err));

const ChatSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: Date,
});

const Chat = mongoose.model('Chat', ChatSchema);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', (data) => {
        const newMessage = new Chat(data);
        newMessage.save().then(() => {
            io.emit('message', data);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});