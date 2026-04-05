import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Modal, TextField, Alert } from '@mui/material';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 560 },
  bgcolor: '#161b22',
  border: '1px solid #30363d',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });
  const [adding, setAdding] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: String(reader.result || '') }));
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError('Name and price are required.');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      await axios.post(`${API_BASE_URL}/api/products`, {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: form.category.trim(),
        image: form.image.trim(),
      });
      setForm({ name: '', price: '', description: '', category: '', image: '' });
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#79c0ff', fontWeight: 'bold' }}>
          Product Store
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={fetchProducts}>Refresh</Button>
          <Button variant="contained" onClick={() => setShowModal(true)}>
            Add Product
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && <Typography sx={{ color: '#8b949e' }}>Loading products...</Typography>}

      {!loading && products.length === 0 && (
        <Typography sx={{ color: '#8b949e' }}>No products available.</Typography>
      )}

      {!loading && products.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onDelete={fetchProducts} />
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box component="form" onSubmit={handleAddProduct} sx={modalStyle}>
          <Typography variant="h6" sx={{ color: '#c9d1d9', mb: 2 }}>
            Create Product
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Name" name="name" value={form.name} onChange={handleFormChange} required />
            <TextField label="Price" name="price" type="number" value={form.price} onChange={handleFormChange} required />
            <TextField label="Category" name="category" value={form.category} onChange={handleFormChange} />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              multiline
              minRows={2}
            />
            <TextField label="Image URL" name="image" value={form.image} onChange={handleFormChange} />
            <Button variant="outlined" component="label">
              Upload Image
              <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Button type="submit" variant="contained" disabled={adding}>
              {adding ? 'Adding...' : 'Add Product'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
