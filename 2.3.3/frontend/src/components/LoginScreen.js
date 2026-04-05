import React, { useEffect, useRef, useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Avatar, Divider
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function LoginScreen({ onJoin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const joinTimerRef = useRef(null);

  useEffect(() => () => {
    if (joinTimerRef.current) {
      clearTimeout(joinTimerRef.current);
    }
  }, []);

  const handleSubmit = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    setIsLoading(true);
    // Simulate connection delay
    joinTimerRef.current = setTimeout(() => {
      onJoin(trimmed);
      joinTimerRef.current = null;
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && username.trim().length >= 2) handleSubmit();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d1117 0%, #1f6feb 50%, #0d1117 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(31, 111, 235, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-50px',
        left: '-50px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Main container */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          width: '100%',
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
          border: '1px solid #30363d',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 50px rgba(31, 111, 235, 0.2)',
          backdropFilter: 'blur(10px)',
          animation: 'slideUp 0.5s ease-out',
          '@keyframes slideUp': {
            from: { transform: 'translateY(40px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 }
          },
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Avatar with animation */}
        <Avatar
          sx={{
            bgcolor: 'transparent',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            fontSize: '3rem',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-12px)' }
            }
          }}
        >
          💬
        </Avatar>

        {/* Title and description */}
        <Typography
          variant="h3"
          fontWeight="bold"
          mb={1}
          sx={{
            color: '#79c0ff',
            letterSpacing: '-1px',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Chat Room
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#8b949e',
            mb: 1,
            fontSize: '1.05rem'
          }}
        >
          Real-time messaging with Socket.IO
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#8b949e',
            display: 'block',
            mb: 3,
            fontSize: '0.8rem',
            opacity: 0.8
          }}
        >
          Experiment 2.3.3 — Full Stack I
        </Typography>

        {/* Divider */}
        <Divider sx={{ my: 3, borderColor: '#30363d' }} />

        {/* Username input section */}
        <Box sx={{ mb: 3, textAlign: 'left' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#c9d1d9',
              display: 'block',
              mb: 1,
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            Choose Your Username
          </Typography>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            fullWidth
            autoFocus
            disabled={isLoading}
            inputProps={{ maxLength: 20 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0d1117',
                color: '#c9d1d9',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                border: '2px solid #30363d',
                '&:hover': {
                  borderColor: '#58a6ff'
                },
                '&.Mui-focused': {
                  borderColor: '#1f6feb',
                  boxShadow: '0 0 0 4px rgba(31, 111, 235, 0.15)'
                },
                '&.Mui-error .MuiOutlinedInput': {
                  borderColor: '#f85149'
                }
              },
              '& .MuiOutlinedInput-input': {
                color: '#c9d1d9',
                fontSize: '1rem',
                fontWeight: 500,
                '&::placeholder': { color: '#8b949e', opacity: 0.6 }
              },
              '& .MuiInputLabel-root': {
                color: '#8b949e !important'
              },
              '& .MuiFormHelperText-root': {
                color: error ? '#f85149' : '#8b949e',
                marginTop: '8px',
                fontSize: '0.8rem'
              }
            }}
          />
        </Box>

        {/* Username suggestions */}
        <Box sx={{ mb: 3, textAlign: 'left' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#8b949e',
              display: 'block',
              mb: 1.5,
              fontSize: '0.75rem',
              letterSpacing: '0.3px'
            }}
          >
            Quick suggestions:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {['Alex', 'Jordan', 'Morgan', 'Casey'].map(name => (
              <Button
                key={name}
                size="small"
                variant="outlined"
                onClick={() => { setUsername(name); setError(''); }}
                disabled={isLoading}
                sx={{
                  borderColor: '#30363d',
                  color: '#58a6ff',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#58a6ff',
                    backgroundColor: 'rgba(88, 166, 255, 0.1)'
                  }
                }}
              >
                {name}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Submit button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading || !username.trim() || username.trim().length < 2}
          sx={{
            py: 1.75,
            fontSize: '1rem',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            background: isLoading ? 'rgba(31, 111, 235, 0.5)' : 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)',
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(31, 111, 235, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(31, 111, 235, 0.4)'
            },
            '&:disabled': {
              opacity: 0.6,
              cursor: 'default'
            }
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 16,
                height: 16,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
              Connecting...
            </Box>
          ) : (
            '→ Enter Chat Room'
          )}
        </Button>

        {/* Footer info */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #30363d', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#8b949e', fontSize: '0.75rem' }}>
            💡 Tip: Other users will see your username in the chat
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
