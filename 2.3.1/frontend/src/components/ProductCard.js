import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function ProductCard({ product, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const fallbackImage = `https://placehold.co/600x400/343a40/ffffff?text=${encodeURIComponent(product.name || 'Product')}`;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      setDeleting(true);
      await axios.delete(`${API_BASE_URL}/api/products/${product._id}`);
      onDelete();
    } catch (err) {
      alert('Failed to delete product');
      setDeleting(false);
    }
  };

  const categoryColors = {
    Electronics: 'primary', Sports: 'success', Kitchen: 'warning', Home: 'info'
  };
  const badgeColor = categoryColors[product.category] || 'secondary';

  return (
    <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}>
      <img
        src={product.image || fallbackImage}
        onError={(e) => {
          if (e.currentTarget.src !== fallbackImage) {
            e.currentTarget.src = fallbackImage;
          }
        }}
        className="card-img-top"
        alt={product.name}
        style={{ height: '180px', objectFit: 'contain', backgroundColor: '#0d1117', padding: '8px' }}
      />
      <div className="card-body d-flex flex-column" style={{ borderTopColor: '#30363d' }}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0 fw-bold" style={{ color: '#c9d1d9' }}>{product.name}</h5>
          <span className={`badge bg-${badgeColor}`}>{product.category}</span>
        </div>
        <p className="card-text flex-grow-1" style={{ color: '#8b949e' }}>{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold" style={{ color: '#58a6ff' }}>${product.price.toFixed(2)}</span>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDelete}
            disabled={deleting}
            style={{ borderColor: '#f85149', color: '#f85149' }}
          >
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
