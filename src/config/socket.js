const jwt = require('jsonwebtoken');
const User = require('../models/User');

const onlineUsers = new Map(); // userId -> socketId

const initSocket = (io) => {
  // Authenticate every socket connection using the JWT token
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);
    onlineUsers.set(socket.user._id.toString(), socket.id);

    // Broadcast that this user is online
    socket.broadcast.emit('userOnline', { userId: socket.user._id });

    require('../sockets/chatHandler')(io, socket, onlineUsers);

    socket.on('disconnect', async () => {
      onlineUsers.delete(socket.user._id.toString());
      socket.user.isOnline = false;
      socket.user.lastSeen = new Date();
      await socket.user.save();

      socket.broadcast.emit('userOffline', { userId: socket.user._id });
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};

module.exports = { initSocket, onlineUsers };