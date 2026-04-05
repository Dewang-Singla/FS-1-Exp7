import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Avatar, Divider } from '@mui/material';

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
    joinTimerRef.current = setTimeout(() => {
      onJoin(trimmed);
      joinTimerRef.current = null;
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && username.trim().length >= 2) {
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '70vh',
        background: 'linear-gradient(135deg, #0d1117 0%, #1f6feb 50%, #0d1117 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        borderRadius: 2,
      }}
    >
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
        }}
      >
        <Avatar sx={{ bgcolor: 'transparent', width: 80, height: 80, mx: 'auto', mb: 3, fontSize: '3rem' }}>
          💬
        </Avatar>

        <Typography variant="h3" fontWeight="bold" mb={1} sx={{ color: '#79c0ff', fontSize: { xs: '2rem', md: '2.5rem' } }}>
          Chat Room
        </Typography>
        <Typography variant="body1" sx={{ color: '#8b949e', mb: 1 }}>
          Real-time messaging with Socket.IO
        </Typography>

        <Divider sx={{ my: 3, borderColor: '#30363d' }} />

        <Box sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="caption" sx={{ color: '#c9d1d9', display: 'block', mb: 1, fontWeight: 600 }}>
            Choose Your Username
          </Typography>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            fullWidth
            autoFocus
            disabled={isLoading}
            inputProps={{ maxLength: 20 }}
          />
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading || !username.trim() || username.trim().length < 2}
          sx={{ py: 1.5, fontWeight: 'bold', background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' }}
        >
          {isLoading ? 'Connecting...' : 'Enter Chat Room'}
        </Button>
      </Paper>
    </Box>
  );
}
