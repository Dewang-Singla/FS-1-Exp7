import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartTotal } from '../store/cartSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export default function CartView() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" sx={{ color: '#c9d1d9' }}>Your cart is empty</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ color: '#c9d1d9' }}>Your Cart</Typography>
        <Button variant="outlined" color="error" startIcon={<ClearAllIcon />} onClick={() => dispatch(clearCart())}>
          Clear All
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ background: '#161b22', border: '1px solid #30363d' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#c9d1d9' }}>Product</TableCell>
              <TableCell sx={{ color: '#c9d1d9' }} align="right">Price</TableCell>
              <TableCell sx={{ color: '#c9d1d9' }} align="center">Qty</TableCell>
              <TableCell sx={{ color: '#c9d1d9' }} align="right">Subtotal</TableCell>
              <TableCell sx={{ color: '#c9d1d9' }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ color: '#c9d1d9' }}>{item.name}</TableCell>
                <TableCell sx={{ color: '#58a6ff' }} align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value, 10) || 0 }))}
                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                    size="small"
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#10b981' }} align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => dispatch(removeFromCart(item.id))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" sx={{ color: '#10b981', mt: 2, textAlign: 'right' }}>
        Total: ${total.toFixed(2)}
      </Typography>
    </>
  );
}
