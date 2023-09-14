// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');


const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

mongoose.connect('mongodb+srv://biswasprasana004:ksLWl8yWy2W5xt59@cluster0.vpsmj3b.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.error('Error occurred while connecting to the database:', err));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', async (msg) => {
        const newMessage = new Message(msg);
        await newMessage.save();
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});