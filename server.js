// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.error('Error occurred while connecting to the database:', err));

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' }]
});

const User = mongoose.model('User', UserSchema);

const ChatRoomSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            message: String,
            timestamp: Date
        }
    ]
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('message', async (data) => {
        const { roomId, userId, message } = data;
        const user = await User.findById(userId);
        if (user) {
            const newMessage = { sender: userId, message, timestamp: new Date() };
            await ChatRoom.findByIdAndUpdate(roomId, { $push: { messages: newMessage } });
            io.to(roomId).emit('message', { ...newMessage, sender: user });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
            res.status(200).send({ token, userId: user._id });
        } else {
            res.status(400).send({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await Chat.find().sort({ timestamp: 1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/chatroom', async (req, res) => {
    try {
        const { userId, contactId } = req.body;

        let chatRoom = await ChatRoom.findOne({ members: { $all: [userId, contactId] } });
        if (!chatRoom) {
            chatRoom = new ChatRoom({ members: [userId, contactId], messages: [] });
            await chatRoom.save();

            await User.findByIdAndUpdate(userId, { $push: { contacts: contactId, chatRooms: chatRoom._id } });
            await User.findByIdAndUpdate(contactId, { $push: { contacts: userId, chatRooms: chatRoom._id } });
        }

        res.status(201).send(chatRoom);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/chatroom/:id/messages', async (req, res) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.id).populate('messages.sender');
        res.status(200).send(chatRoom.messages);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});