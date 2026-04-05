import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCartCount } from './store/cartSlice';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AppBar, Toolbar, Typography, Badge, IconButton, Container, Tabs, Tab, Box, CssBaseline, Button
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1f6feb' },
    secondary: { main: '#58a6ff' },
    background: { default: '#0d1117', paper: '#161b22' },
    text: { primary: '#c9d1d9', secondary: '#8b949e' },
  },
  typography: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
});

const PRODUCTS = [
  { id: 1, name: 'Smartphone', price: 299.99, category: 'Electronics', description: 'Latest model with 5G', emoji: '📱' },
  { id: 2, name: 'Tablet', price: 449.99, category: 'Electronics', description: '10-inch display, 128GB', emoji: '📟' },
  { id: 3, name: 'Smartwatch', price: 199.99, category: 'Wearables', description: 'Health tracking & GPS', emoji: '⌚' },
  { id: 4, name: 'Laptop', price: 899.99, category: 'Computers', description: '16GB RAM, 512GB SSD', emoji: '💻' },
  { id: 5, name: 'Wireless Earbuds', price: 129.99, category: 'Audio', description: 'Noise cancellation', emoji: '🎧' },
  { id: 6, name: 'Keyboard', price: 79.99, category: 'Peripherals', description: 'Mechanical RGB keyboard', emoji: '⌨️' },
];

export default function App() {
  const [tab, setTab] = useState(0);
  const cartCount = useSelector(selectCartCount);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gridTemplateRows: { xs: 'auto 1fr', md: '1fr' } }}>
        {/* Sidebar Navigation */}
        <Box sx={{
          gridColumn: { xs: '1', md: '1' },
          gridRow: { xs: '1', md: '1' },
          background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
          borderRight: '1px solid #30363d',
          padding: { xs: '16px', md: '24px' },
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: { xs: '8px', md: '0' },
          overflowX: { xs: 'auto', md: 'hidden' },
          '@media (max-width: 900px)': {
            gridColumn: '1 / -1',
            gridRow: '1',
            flexDirection: 'row',
            paddingBottom: '12px',
            borderBottom: '1px solid #30363d',
            borderRight: 'none'
          }
        }}>
          <Box sx={{ mb: { xs: 0, md: '32px' }, display: { xs: 'none', md: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#79c0ff', letterSpacing: '0.5px', mb: 2 }}>
              🛒 Shop
            </Typography>
            <Typography variant="caption" sx={{ color: '#8b949e', fontSize: '0.75rem' }}>
              Experiment 2.3.2
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: '12px', width: '100%' }}>
            <Button
              fullWidth
              startIcon={<StoreIcon />}
              onClick={() => setTab(0)}
              sx={{
                justifyContent: { xs: 'center', md: 'flex-start' },
                background: tab === 0 ? 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' : 'transparent',
                color: tab === 0 ? 'white' : '#8b949e',
                borderRadius: '8px',
                padding: '12px 16px',
                fontWeight: tab === 0 ? 600 : 500,
                transition: 'all 0.3s ease',
                border: tab === 0 ? 'none' : '1px solid #30363d',
                '&:hover': {
                  background: tab === 0 ? 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' : '#30363d',
                  color: '#c9d1d9'
                }
              }}
            >
              Products
            </Button>
            <Button
              fullWidth
              startIcon={<ShoppingCartIcon />}
              onClick={() => setTab(1)}
              sx={{
                justifyContent: { xs: 'center', md: 'flex-start' },
                background: tab === 1 ? 'linear-gradient(135deg, #10b981 0%, #238636 100%)' : 'transparent',
                color: tab === 1 ? 'white' : '#8b949e',
                borderRadius: '8px',
                padding: '12px 16px',
                fontWeight: tab === 1 ? 600 : 500,
                transition: 'all 0.3s ease',
                border: tab === 1 ? 'none' : '1px solid #30363d',
                position: 'relative',
                '&:hover': {
                  background: tab === 1 ? 'linear-gradient(135deg, #10b981 0%, #238636 100%)' : '#30363d',
                  color: '#c9d1d9'
                }
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <span>Cart</span>
                {cartCount > 0 && (
                  <Box sx={{
                    minWidth: 22,
                    height: 22,
                    px: 0.75,
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f85149 0%, #ff6b6b 100%)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 10px rgba(248, 81, 73, 0.3)'
                  }}>
                    {cartCount}
                  </Box>
                )}
              </Box>
            </Button>
          </Box>
        </Box>

        {/* Top Header for Mobile */}
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          gridColumn: { xs: '1 / -1', md: 'auto' },
          gridRow: { xs: '1', md: 'auto' },
          background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 50%, #0d1117 100%)',
          borderBottom: '2px solid #30363d',
          padding: '20px 16px',
          mb: 0
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#79c0ff', letterSpacing: '-0.5px' }}>
            🛒 Redux Shopping
          </Typography>
          <Typography variant="caption" sx={{ color: '#c9d1d9' }}>
            Experiment 2.3.2
          </Typography>
        </Box>

        {/* Main Content Area */}
        <Box sx={{
          gridColumn: { xs: '1', md: '2' },
          gridRow: { xs: '2', md: '1' },
          background: '#0d1117',
          overflow: 'auto'
        }}>
          <Box sx={{ padding: { xs: '20px', md: '40px' } }}>
            {tab === 0 && <ProductList products={PRODUCTS} />}
            {tab === 1 && <CartView />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
