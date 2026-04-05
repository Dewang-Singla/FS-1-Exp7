import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ChatIcon from '@mui/icons-material/Chat';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';

const linkStyle = {
  color: '#c9d1d9',
  textTransform: 'none',
  borderRadius: '8px',
  px: 1.5,
  py: 0.75,
};

export default function Navbar() {
  const cartCount = useSelector(selectCartCount);

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #161b22 0%, #1f6feb 50%, #0d1117 100%)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#79c0ff' }}>
          Experiment 2.3
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={NavLink}
            to="/products"
            startIcon={<StorefrontIcon />}
            sx={linkStyle}
            style={({ isActive }) => ({ backgroundColor: isActive ? '#1f6feb' : 'transparent', color: isActive ? '#fff' : '#c9d1d9' })}
          >
            Products
          </Button>

          <Button
            component={NavLink}
            to="/cart"
            startIcon={
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            }
            sx={linkStyle}
            style={({ isActive }) => ({ backgroundColor: isActive ? '#1f6feb' : 'transparent', color: isActive ? '#fff' : '#c9d1d9' })}
          >
            Cart
          </Button>

          <Button
            component={NavLink}
            to="/chat"
            startIcon={<ChatIcon />}
            sx={linkStyle}
            style={({ isActive }) => ({ backgroundColor: isActive ? '#1f6feb' : 'transparent', color: isActive ? '#fff' : '#c9d1d9' })}
          >
            Chat
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
