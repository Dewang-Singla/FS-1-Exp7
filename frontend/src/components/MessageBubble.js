import React from 'react';
import { Box, Avatar, Typography, Paper } from '@mui/material';

const COLORS = [
  '#58a6ff',
  '#79c0ff',
  '#1f6feb',
  '#388bfd',
  '#10b981',
  '#238636',
  '#6e40aa',
  '#d1603d',
  '#f0883e',
];

const getColor = (name) => {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % COLORS.length;
  }
  return COLORS[hash];
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function SystemMessage({ text, timestamp }) {
  return (
    <Box textAlign="center" my={1.5}>
      <Typography
        variant="caption"
        sx={{
          bgcolor: '#30363d',
          color: '#8b949e',
          px: 2.5,
          py: 0.75,
          borderRadius: 3,
          display: 'inline-block',
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      >
        {text} · {formatTime(timestamp)}
      </Typography>
    </Box>
  );
}

export default function MessageBubble({ message, isOwn }) {
  const color = getColor(message.username);
  const initials = message.username.slice(0, 2).toUpperCase();

  return (
    <Box
      display="flex"
      flexDirection={isOwn ? 'row-reverse' : 'row'}
      alignItems="flex-end"
      gap={1.5}
      mb={1.5}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 40,
          height: 40,
          fontSize: '0.85rem',
          flexShrink: 0,
          fontWeight: 600,
        }}
      >
        {initials}
      </Avatar>
      <Box maxWidth="70%" minWidth={80}>
        <Typography
          variant="caption"
          sx={{
            color: '#8b949e',
            display: 'block',
            textAlign: isOwn ? 'right' : 'left',
            mb: 0.5,
            fontSize: '0.7rem',
            fontWeight: 500,
          }}
        >
          {isOwn ? 'You' : message.username} · {formatTime(message.timestamp)}
        </Typography>
        <Paper
          elevation={isOwn ? 2 : 3}
          sx={{
            px: 2.5,
            py: 1.2,
            background: isOwn ? 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' : '#161b22',
            color: isOwn ? 'white' : '#c9d1d9',
            borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            border: isOwn ? 'none' : '1px solid #30363d',
          }}
        >
          <Typography variant="body2" sx={{ wordBreak: 'break-word', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {message.text}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
