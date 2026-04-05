const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection (update URI as needed)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/productsdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

// Seed data
const seedProducts = [
  { name: 'Wireless Headphones', price: 59.99, description: 'Premium sound quality', category: 'Electronics', image: 'https://placehold.co/600x400/0d6efd/ffffff?text=Wireless+Headphones' },
  { name: 'Running Shoes', price: 89.99, description: 'Lightweight and comfortable', category: 'Sports', image: 'https://placehold.co/600x400/198754/ffffff?text=Running+Shoes' },
  { name: 'Coffee Maker', price: 49.99, description: 'Brew perfect coffee every time', category: 'Kitchen', image: 'https://placehold.co/600x400/f39c12/ffffff?text=Coffee+Maker' },
  { name: 'Yoga Mat', price: 29.99, description: 'Non-slip premium yoga mat', category: 'Sports', image: 'https://placehold.co/600x400/20c997/ffffff?text=Yoga+Mat' },
  { name: 'Desk Lamp', price: 39.99, description: 'LED adjustable desk lamp', category: 'Home', image: 'https://placehold.co/600x400/0dcaf0/ffffff?text=Desk+Lamp' },
  { name: 'Bluetooth Speaker', price: 79.99, description: 'Waterproof portable speaker', category: 'Electronics', image: 'https://placehold.co/600x400/6610f2/ffffff?text=Bluetooth+Speaker' },
];

// Routes
app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();
    if (products.length === 0) {
      products = await Product.insertMany(seedProducts);
    }
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
