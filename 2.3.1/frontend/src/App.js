import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function App() {
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
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => {}; // cleanup
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
      setError('Failed to read image file. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setError('Name and price are required to add a product.');
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
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#0d1117' }}>
      {/* Header with Hero Section */}
      <header style={{ background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 50%, #0d1117 100%)', borderBottom: '2px solid #30363d', paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="fw-bold mb-2" style={{ color: '#79c0ff', fontSize: '2.5rem', letterSpacing: '-0.5px' }}>🛍️ Product Store</h1>
              <p style={{ color: '#c9d1d9', fontSize: '1.1rem', margin: 0 }}>Modern e-commerce with React, Axios & Express</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#58a6ff', fontWeight: 600, margin: '0 0 8px 0' }}>Experiment 2.3.1</p>
              <button 
                onClick={() => setShowModal(true)} 
                className="btn fw-bold" 
                style={{ 
                  background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', 
                  color: 'white', 
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 16px rgba(35, 134, 54, 0.3)'
                }}
              >
                ➕ Add Product
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: '#8b949e' }}>📊 Total Products:</span>
            <span style={{ color: '#79c0ff', fontWeight: 'bold', fontSize: '1.3rem' }}>{products.length}</span>
            <button 
              onClick={fetchProducts} 
              className="btn" 
              style={{ 
                borderColor: '#30363d', 
                color: '#58a6ff',
                marginLeft: 'auto'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="container py-5">
        {/* Add Product Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#161b22',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              border: '1px solid #30363d',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              animation: 'slideUp 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: '#c9d1d9', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Product</h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8b949e',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Product Name *</label>
                  <input
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9', padding: '10px 12px' }}
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Price *</label>
                    <input
                      className="form-control"
                      style={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9', padding: '10px 12px' }}
                      name="price"
                      value={form.price}
                      onChange={handleFormChange}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Category</label>
                    <input
                      className="form-control"
                      style={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9', padding: '10px 12px' }}
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      placeholder="e.g., Electronics"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Description</label>
                  <textarea
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9', padding: '10px 12px', minHeight: '80px' }}
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Product details..."
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Image URL</label>
                  <input
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9', padding: '10px 12px' }}
                    name="image"
                    value={form.image}
                    onChange={handleFormChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#c9d1d9', display: 'block', marginBottom: '6px', fontWeight: 500 }}>Upload Image</label>
                  <input
                    className="form-control"
                    style={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9', padding: '10px 12px' }}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                {form.image && (
                  <div style={{ marginBottom: '16px' }}>
                    <img
                      src={form.image}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        backgroundColor: '#0d1117',
                        borderRadius: '8px',
                        border: '1px solid #30363d',
                        padding: '8px'
                      }}
                    />
                  </div>
                )}

                {error && (
                  <div style={{ backgroundColor: '#3d1f1a', borderLeft: '4px solid #f85149', color: '#f85149', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => { setShowModal(false); setError(null); }}
                    style={{
                      backgroundColor: '#30363d',
                      color: '#c9d1d9',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={adding}
                    style={{
                      background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: adding ? 0.7 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {adding ? '⏳ Adding...' : '✓ Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #30363d',
              borderTop: '4px solid #58a6ff',
              borderRadius: '50%',
              margin: '0 auto 24px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#8b949e', fontSize: '1.1rem' }}>Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !showModal && (
          <div style={{
            backgroundColor: '#3d1f1a',
            borderLeft: '4px solid #f85149',
            color: '#f85149',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>Error:</strong> {error}
            </div>
            <button 
              onClick={() => setError(null)} 
              style={{
                background: 'none',
                border: 'none',
                color: '#f85149',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && !error && (
          <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 16px 0' }}>📦</p>
            <h3 style={{ color: '#c9d1d9', marginBottom: '8px' }}>No Products Yet</h3>
            <p style={{ color: '#8b949e', marginBottom: '24px' }}>Click the "Add Product" button to create your first product</p>
            <button 
              onClick={() => setShowModal(true)} 
              className="btn fw-bold" 
              style={{ 
                background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', 
                color: 'white', 
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px'
              }}
            >
              ➕ Create First Product
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', paddingBottom: '40px' }}>
            {products.map(product => (
              <div key={product._id} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                <ProductCard product={product} onDelete={fetchProducts} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
