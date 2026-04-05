const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by Socket.IO CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    onlineUsers: onlineUsers.size,
    allowedOrigins,
  });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('user:join', (username) => {
    onlineUsers.set(socket.id, username);

    socket.broadcast.emit('message:system', {
      text: `${username} joined the chat`,
      timestamp: new Date().toISOString(),
    });

    io.emit('users:update', Array.from(onlineUsers.values()));
  });

  socket.on('message:send', (data) => {
    const username = onlineUsers.get(socket.id) || 'Anonymous';
    const message = {
      id: Date.now(),
      username,
      text: data.text,
      timestamp: new Date().toISOString(),
    };
    io.emit('message:receive', message);
  });

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

  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      onlineUsers.delete(socket.id);
      io.emit('message:system', {
        text: `${username} left the chat`,
        timestamp: new Date().toISOString(),
      });
      io.emit('users:update', Array.from(onlineUsers.values()));
    }
  });
});

async function startServer() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is required in environment variables.');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Unified API + Socket.IO server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
