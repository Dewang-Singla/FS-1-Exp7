import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from '../store/cartSlice';
import { Grid, Card, CardContent, Typography, Button, Chip, Box, Snackbar, Alert } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductList({ products }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [snack, setSnack] = useState('');

  const getCartQty = (id) => cartItems.find((item) => item.id === id)?.quantity || 0;

  const handleAdd = (product) => {
    dispatch(addToCart(product));
    setSnack(`${product.emoji} ${product.name} added to cart!`);
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold" sx={{ color: '#79c0ff', mb: 2 }}>
        Browse Products
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => {
          const qty = getCartQty(product.id);
          return (
            <Grid item xs={12} sm={6} lg={4} key={product.id}>
              <Card sx={{ height: '100%', backgroundColor: '#161b22', border: '1px solid #30363d' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#c9d1d9' }}>{product.name}</Typography>
                    <Chip label={product.category} size="small" sx={{ background: '#1f6feb', color: 'white' }} />
                  </Box>
                  <Typography sx={{ color: '#8b949e', mb: 1 }}>{product.description}</Typography>
                  <Typography variant="h6" sx={{ color: '#10b981', mb: 1 }}>${product.price.toFixed(2)}</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAdd(product)}
                    sx={{ background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' }}
                  >
                    {qty > 0 ? `Add More (${qty})` : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar open={!!snack} autoHideDuration={2500} onClose={() => setSnack('')}>
        <Alert severity="success" variant="filled">
          {snack}
        </Alert>
      </Snackbar>
    </>
  );
}
