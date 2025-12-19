// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Member = require('../models/member');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  // Create user
  const user = new User({ name, email, password, role });

  // If registering a student, auto-create or link a Member record
  if (role === 'student') {
    // Try to find existing member by email
    let member = await Member.findOne({ email });
    if (!member) {
      member = new Member({ name, email });
      await member.save();
    }
    user.memberId = member._id;
  }

  await user.save();

  // Send response
  res.status(201).json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, memberId: user.memberId }
  });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Send token + user
  res.json({
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, memberId: user.memberId }
  });
};
