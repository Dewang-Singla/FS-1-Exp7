import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Chip,
  Paper,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageBubble, { SystemMessage } from './MessageBubble';

const TYPING_TIMEOUT = 1500;

export default function ChatRoom({ socket, username, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers, scrollToBottom]);

  useEffect(() => {
    socket.on('message:receive', (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: 'user' }]);
    });

    socket.on('message:system', (msg) => {
      setMessages((prev) => [...prev, { ...msg, id: Date.now(), type: 'system' }]);
    });

    socket.on('users:update', (users) => {
      setOnlineUsers(users);
    });

    socket.on('typing:update', ({ username: typingUser, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping
          ? [...prev.filter((user) => user !== typingUser), typingUser]
          : prev.filter((user) => user !== typingUser)
      );
    });

    return () => {
      socket.off('message:receive');
      socket.off('message:system');
      socket.off('users:update');
      socket.off('typing:update');
    };
  }, [socket]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    socket.emit('message:send', { text });
    setInput('');

    if (isTypingRef.current) {
      socket.emit('typing:stop');
      isTypingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!isTypingRef.current) {
      socket.emit('typing:start');
      isTypingRef.current = true;
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit('typing:stop');
      isTypingRef.current = false;
    }, TYPING_TIMEOUT);
  };

  const handleLeave = () => {
    socket.disconnect();
    onLeave();
  };

  const typingText =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : typingUsers.length > 1
        ? `${typingUsers.join(', ')} are typing...`
        : '';

  return (
    <Box sx={{ minHeight: '80vh', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '240px 1fr' }, gridTemplateRows: 'auto 1fr auto' }}>
      <AppBar position="static" sx={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #161b22 0%, #1f6feb 50%, #0d1117 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: '#79c0ff', fontWeight: 'bold' }}>
            Chat Room
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={`You are: ${username}`}>
            <Chip
              icon={<Badge overlap="circular" variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: '#10b981' } }}><span> </span></Badge>}
              label={username}
              sx={{ mr: 1, background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)', color: 'white' }}
            />
          </Tooltip>
          <Chip icon={<PeopleIcon />} label={onlineUsers.length} sx={{ mr: 1, background: 'linear-gradient(135deg, #10b981 0%, #238636 100%)', color: 'white' }} />
          <IconButton color="inherit" onClick={handleLeave} sx={{ color: '#ff6b6b' }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, gridColumn: '1', gridRow: '2', flexDirection: 'column', p: 2, borderRight: '1px solid #30363d', bgcolor: '#161b22' }}>
        <Typography variant="subtitle2" sx={{ color: '#79c0ff', mb: 1.5 }}>Active Users</Typography>
        {onlineUsers.map((user) => (
          <Typography key={user} variant="body2" sx={{ color: user === username ? '#79c0ff' : '#c9d1d9', mb: 0.75 }}>
            {user}{user === username ? ' (You)' : ''}
          </Typography>
        ))}
      </Box>

      <Box sx={{ gridColumn: { xs: '1', sm: '2' }, gridRow: '2', overflowY: 'auto', p: 2 }}>
        {messages.length === 0 && (
          <Box textAlign="center" my={6}>
            <Typography sx={{ color: '#c9d1d9' }}>Start a conversation.</Typography>
          </Box>
        )}

        {messages.map((msg) =>
          msg.type === 'system' ? (
            <SystemMessage key={msg.id} text={msg.text} timestamp={msg.timestamp} />
          ) : (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.username === username} />
          )
        )}

        {typingText && (
          <Typography variant="caption" sx={{ color: '#58a6ff', fontStyle: 'italic', ml: 1 }}>
            {typingText}
          </Typography>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Divider sx={{ gridColumn: '1 / -1', borderColor: '#30363d' }} />

      <Paper sx={{ gridColumn: { xs: '1', sm: '2' }, gridRow: '3', borderRadius: 0, p: 2, bgcolor: '#161b22' }}>
        <Box display="flex" gap={1}>
          <TextField
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            fullWidth
            multiline
            maxRows={4}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim()}
            sx={{ background: input.trim() ? 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' : 'rgba(31, 111, 235, 0.3)', color: 'white' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
