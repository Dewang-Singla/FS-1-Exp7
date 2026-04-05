import React from 'react';
import { Box, Avatar, Typography, Paper } from '@mui/material';

const COLORS = [
  '#58a6ff', '#79c0ff', '#1f6feb', '#388bfd', '#10b981', '#238636', '#6e40aa', '#d1603d', '#f0883e'
];

const getColor = (name) => {
  let hash = 0;
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) % COLORS.length;
  return COLORS[hash];
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function SystemMessage({ text, timestamp }) {
  return (
    <Box textAlign="center" my={1.5} sx={{ animation: 'fadeInDown 0.4s ease-out', '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
      <Typography variant="caption" sx={{ bgcolor: '#30363d', color: '#8b949e', px: 2.5, py: 0.75, borderRadius: 3, display: 'inline-block', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.3px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
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
      sx={{ animation: 'fadeInUp 0.4s ease-out', '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}
    >
      <Avatar sx={{ bgcolor: color, width: 40, height: 40, fontSize: '0.85rem', flexShrink: 0, fontWeight: 600, boxShadow: `0 4px 12px ${color}40` }}>
        {initials}
      </Avatar>
      <Box maxWidth="70%" minWidth={80}>
        <Typography
          variant="caption"
          sx={{ color: '#8b949e', display: 'block', textAlign: isOwn ? 'right' : 'left', mb: 0.5, fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.2px' }}
        >
          {isOwn ? 'You' : message.username} · {formatTime(message.timestamp)}
        </Typography>
        <Paper
          elevation={isOwn ? 2 : 3}
          sx={{
            px: 2.5, py: 1.2,
            background: isOwn ? 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' : '#161b22',
            color: isOwn ? 'white' : '#c9d1d9',
            borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isOwn ? '0 8px 24px rgba(31, 111, 235, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: isOwn ? 'none' : '1px solid #30363d',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isOwn ? '0 12px 32px rgba(31, 111, 235, 0.4)' : '0 6px 16px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <Typography variant="body2" sx={{ wordBreak: 'break-word', fontSize: '0.95rem', lineHeight: 1.5, fontWeight: isOwn ? 500 : 400 }}>
            {message.text}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
