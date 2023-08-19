// routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

router.get('/all', getAllUsers);

module.exports = router;