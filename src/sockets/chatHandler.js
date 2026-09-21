const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

module.exports = (io, socket, onlineUsers) => {
  // Join a conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Send a real-time message
  socket.on('sendMessage', async ({ conversationId, receiverId, content }) => {
    try {
      let conversation = conversationId
        ? await Conversation.findById(conversationId)
        : await Conversation.findOne({
            participants: { $all: [socket.user._id, receiverId] },
          });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [socket.user._id, receiverId],
        });
      }

      const message = await Message.create({
        conversation: conversation._id,
        sender: socket.user._id,
        content,
      });

      conversation.lastMessage = message._id;
      await conversation.save();

      io.to(conversation._id.toString()).emit('newMessage', message);

      // Also notify the receiver directly if they're online but not in the room
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('notification', {
          type: 'message',
          from: socket.user.username,
          conversationId: conversation._id,
        });
      }
    } catch (error) {
      socket.emit('errorMessage', { message: error.message });
    }
  });

  // Typing indicator
  socket.on('typing', ({ conversationId }) => {
    socket.to(conversationId).emit('userTyping', { userId: socket.user._id });
  });
};