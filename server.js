// server.js
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

mongoose.connect('mongodb+srv://biswasprasana004:ksLWl8yWy2W5xt59@cluster0.vpsmj3b.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.error('Error occurred while connecting to the database:', err));

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

const ChatSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: Date,
});

const Chat = mongoose.model('Chat', ChatSchema);

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('message', async (data) => {
        const newMessage = new Chat({ username: data.username, message: data.message, timestamp: new Date() });
        await newMessage.save();
        io.emit('message', { username: data.username, message: data.message, timestamp: new Date() });
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
            res.status(200).send({ token, username });
        } else {
            res.status(400).send({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});