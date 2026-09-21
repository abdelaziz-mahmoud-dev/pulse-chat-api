const express = require('express');
const { getMe, getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/:id', protect, getUserById);
router.get('/', protect, getUsers);

module.exports = router;