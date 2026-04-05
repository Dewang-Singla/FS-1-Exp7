import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import ProductList from '../components/ProductList';
import CartView from '../components/CartView';

const PRODUCTS = [
  { id: 1, name: 'Smartphone', price: 299.99, category: 'Electronics', description: 'Latest model with 5G', emoji: '📱' },
  { id: 2, name: 'Tablet', price: 449.99, category: 'Electronics', description: '10-inch display, 128GB', emoji: '📟' },
  { id: 3, name: 'Smartwatch', price: 199.99, category: 'Wearables', description: 'Health tracking and GPS', emoji: '⌚' },
  { id: 4, name: 'Laptop', price: 899.99, category: 'Computers', description: '16GB RAM, 512GB SSD', emoji: '💻' },
  { id: 5, name: 'Wireless Earbuds', price: 129.99, category: 'Audio', description: 'Noise cancellation', emoji: '🎧' },
  { id: 6, name: 'Keyboard', price: 79.99, category: 'Peripherals', description: 'Mechanical RGB keyboard', emoji: '⌨️' },
];

export default function CartPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#79c0ff', fontWeight: 'bold', mb: 3 }}>
        Redux Shopping Cart
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, background: '#0d1117', border: '1px solid #30363d' }}>
            <ProductList products={PRODUCTS} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, background: '#0d1117', border: '1px solid #30363d' }}>
            <CartView />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
