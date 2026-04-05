const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Track online users: { socketId -> username }
const onlineUsers = new Map();

// REST health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', onlineUsers: onlineUsers.size });
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // User joins chat
  socket.on('user:join', (username) => {
    onlineUsers.set(socket.id, username);
    console.log(`${username} joined`);

    // Broadcast join notification to all others
    socket.broadcast.emit('message:system', {
      text: `${username} joined the chat`,
      timestamp: new Date().toISOString(),
    });

    // Send updated user list to everyone
    io.emit('users:update', Array.from(onlineUsers.values()));
  });

  // Handle new message
  socket.on('message:send', (data) => {
    const username = onlineUsers.get(socket.id) || 'Anonymous';
    const message = {
      id: Date.now(),
      username,
      text: data.text,
      timestamp: new Date().toISOString(),
    };
    // Broadcast to everyone including sender
    io.emit('message:receive', message);
  });

  // Typing indicator
  socket.on('typing:start', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      socket.broadcast.emit('typing:update', { username, isTyping: true });
    }
  });

  socket.on('typing:stop', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      socket.broadcast.emit('typing:update', { username, isTyping: false });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      onlineUsers.delete(socket.id);
      io.emit('message:system', {
        text: `${username} left the chat`,
        timestamp: new Date().toISOString(),
      });
      io.emit('users:update', Array.from(onlineUsers.values()));
      console.log(`${username} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Socket.IO server running on port ${PORT}`));
