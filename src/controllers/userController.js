const User = require('../models/User');

// @desc    Get logged-in user's profile
// @route   GET /api/users/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Get all users (excluding self)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      'username email isOnline lastSeen'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single user by id
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      'username email isOnline lastSeen'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, getUsers, getUserById };