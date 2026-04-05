import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart, updateQuantity, clearCart,
  selectCartItems, selectCartTotal
} from '../store/cartSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Button, IconButton, TextField, Box, Divider, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export default function CartView() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={8} sx={{ animation: 'fadeInDown 0.4s ease-out', '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-16px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
        <Typography variant="h1" mb={2}>🛒</Typography>
        <Typography variant="h5" sx={{ color: '#c9d1d9' }}>Your cart is empty</Typography>
        <Typography sx={{ color: '#8b949e', mt: 1 }}>Switch to Products tab to add items</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#c9d1d9', letterSpacing: '0.5px' }}>Your Cart</Typography>
        <Button
          variant="outlined" sx={{ color: '#ff6b6b', borderColor: '#ff6b6b', transition: 'all 0.3s ease', '&:hover': { borderColor: '#ff8888', backgroundColor: 'rgba(255, 107, 107, 0.08)' } }} startIcon={<ClearAllIcon />}
          onClick={() => dispatch(clearCart())}
        >
          Clear All
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={4} sx={{ background: '#161b22', borderRadius: '12px', border: '1px solid #30363d' }}>
        <Table>
          <TableHead sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.3px', py: 2 }}>Product</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.3px', py: 2 }} align="right">Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.3px', py: 2 }} align="center">Quantity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.3px', py: 2 }} align="right">Subtotal</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.3px', py: 2 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id} sx={{ borderBottom: '1px solid #30363d', transition: 'all 0.3s ease', '&:hover': { backgroundColor: '#0d1117', transform: 'scaleX(1.01)' } }}>
                <TableCell sx={{ color: '#c9d1d9' }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>{item.emoji}</span>
                    <Typography sx={{ fontWeight: '500', color: '#c9d1d9' }}>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: '#58a6ff', fontWeight: '600', fontSize: '0.95rem' }}>${item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={e => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) || 0 }))}
                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                    size="small"
                    sx={{ width: 80, '& .MuiOutlinedInput-root': { backgroundColor: '#0d1117', borderRadius: '6px', '& fieldset': { borderColor: '#30363d' }, '&:hover fieldset': { borderColor: '#58a6ff' }, '&.Mui-focused fieldset': { borderColor: '#58a6ff', boxShadow: '0 0 0 3px rgba(88, 166, 255, 0.15)' } }, '& .MuiOutlinedInput-input': { color: '#c9d1d9' } }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', background: 'linear-gradient(90deg, #10b981 0%, #238636 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '0.95rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton sx={{ color: '#ff6b6b', transition: 'all 0.3s ease', '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)', transform: 'translateY(-2px)' } }} onClick={() => dispatch(removeFromCart(item.id))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper elevation={4} sx={{ mt: 3, p: 3, background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)', borderTop: '2px solid #30363d', borderRadius: '12px' }}>
        <Divider sx={{ mb: 2, borderColor: '#30363d' }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#c9d1d9', letterSpacing: '0.3px' }}>Total</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #10b981 0%, #238636 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${total.toFixed(2)}</Typography>
        </Box>
        <Button variant="contained" fullWidth size="large" sx={{ mt: 2.5, background: 'linear-gradient(135deg, #238636 0%, #2ea043 100%)', fontWeight: '600', fontSize: '1rem', letterSpacing: '0.3px', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(35, 134, 54, 0.4)' } }}>
          Proceed to Checkout
        </Button>
        <Alert severity="info" sx={{ mt: 2.5, backgroundColor: '#0d47a1', color: '#58a6ff', borderLeft: '4px solid #58a6ff', '& .MuiAlert-icon': { color: '#58a6ff' }, fontSize: '0.9rem' }}>
          Cart is persisted to localStorage — refresh the page to verify!
        </Alert>
      </Paper>
    </>
  );
}
