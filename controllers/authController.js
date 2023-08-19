// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, 'Biswas@2001', { expiresIn: '1h' });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Generate a JWT token for the user
    const token = generateAccessToken(newUser._id);

    res.status(201).json({ token, userId: newUser._id, username: newUser.username });
  } catch (error) {
     
    res.status(500).json({ error: 'Error registering user' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the user
    const token = generateAccessToken(user._id);

    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

module.exports = { registerUser, loginUser, getAllUsers };