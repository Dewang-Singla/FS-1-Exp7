import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../store/cartSlice';
import {
  Grid, Card, CardContent, Typography, Button, Chip, Box, Snackbar, Alert
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useState } from 'react';

export default function ProductList({ products }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [snack, setSnack] = useState('');

  const getCartQty = (id) => cartItems.find(i => i.id === id)?.quantity || 0;

  const handleAdd = (product) => {
    dispatch(addToCart(product));
    setSnack(`${product.emoji} ${product.name} added to cart!`);
  };

  const averagePrice = products.length > 0
    ? products.reduce((sum, product) => sum + product.price, 0) / products.length
    : 0;

  return (
    <>
      {/* Section Header */}
      <Box sx={{ mb: 4, animation: 'fadeInDown 0.5s ease-out', '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-16px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#79c0ff', letterSpacing: '-0.5px', mb: 1 }}>
          🛍️ Browse Products
        </Typography>
        <Typography variant="body1" sx={{ color: '#8b949e', mb: 2 }}>
          Discover our {products.length} premium items and add them to your cart
        </Typography>
        <Box sx={{ height: '2px', background: 'linear-gradient(90deg, #1f6feb 0%, transparent 100%)', maxWidth: '60px' }} />
      </Box>

      {/* Stats Bar */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: '16px',
        mb: 4
      }}>
        {[
          { label: 'Total Products', value: products.length, icon: '📦' },
          { label: 'Categories', value: new Set(products.map(p => p.category)).size, icon: '🏷️' },
          { label: 'Avg Price', value: `$${averagePrice.toFixed(0)}`, icon: '💰' },
          { label: 'Items in Cart', value: cartItems.reduce((a, i) => a + i.quantity, 0), icon: '🛒' }
        ].map((stat, idx) => (
          <Box key={idx} sx={{
            background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
            border: '1px solid #30363d',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <Typography sx={{ fontSize: '1.8rem', mb: 1 }}>{stat.icon}</Typography>
            <Typography variant="body2" sx={{ color: '#8b949e', mb: 0.5 }}>{stat.label}</Typography>
            <Typography variant="h6" sx={{ color: '#79c0ff', fontWeight: 'bold' }}>{stat.value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {products.map((product, idx) => {
          const qty = getCartQty(product.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`, '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
              <Card elevation={3} sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #1f6feb 0%, #388bfd 50%, transparent 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: '#58a6ff',
                  boxShadow: '0 16px 40px rgba(88, 166, 255, 0.15)',
                  '&::before': { opacity: 1 }
                }
              }}>
                {/* Product Category Badge */}
                <Box sx={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  animation: 'slideIn 0.3s ease-out'
                }}>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: '24px',
                      boxShadow: '0 4px 12px rgba(31, 111, 235, 0.3)'
                    }}
                  />
                </Box>

                {/* Emoji Display */}
                <Box sx={{
                  fontSize: '4rem',
                  textAlign: 'center',
                  py: 3,
                  background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
                  borderBottom: '1px solid #30363d',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    display: 'inline-block',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': { transform: 'scale(1.2) rotate(5deg)' }
                  }}>
                    {product.emoji}
                  </Box>
                </Box>

                {/* Content */}
                <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{
                    fontSize: '1rem',
                    color: '#c9d1d9',
                    mb: 0.5,
                    lineHeight: 1.4,
                    minHeight: '28px'
                  }}>
                    {product.name}
                  </Typography>

                  <Typography variant="body2" sx={{
                    color: '#8b949e',
                    mb: 2,
                    minHeight: '40px',
                    fontSize: '0.85rem',
                    lineHeight: 1.4
                  }}>
                    {product.description}
                  </Typography>

                  {/* Price Section */}
                  <Box sx={{
                    mt: 'auto',
                    pt: 2,
                    borderTop: '1px solid #30363d',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#8b949e', display: 'block', mb: 0.5 }}>Price</Typography>
                      <Typography variant="h6" sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #238636 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: '1.3rem'
                      }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAdd(product)}
                      sx={{
                        background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(31, 111, 235, 0.4)'
                        }
                      }}
                    >
                      {qty > 0 ? `+${qty}` : 'Add'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Success Notification */}
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #238636 100%)',
            fontSize: '0.95rem',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          ✓ {snack}
        </Alert>
      </Snackbar>
    </>
  );
}
