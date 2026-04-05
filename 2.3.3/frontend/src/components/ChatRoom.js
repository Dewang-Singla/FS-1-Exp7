import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, AppBar, Toolbar, Typography, TextField, IconButton,
  Chip, Paper, Divider, Badge, Tooltip
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
    // Socket event listeners
    socket.on('message:receive', (msg) => {
      setMessages(prev => [...prev, { ...msg, type: 'user' }]);
    });

    socket.on('message:system', (msg) => {
      setMessages(prev => [...prev, { ...msg, id: Date.now(), type: 'system' }]);
    });

    socket.on('users:update', (users) => {
      setOnlineUsers(users);
    });

    socket.on('typing:update', ({ username: typingUser, isTyping }) => {
      setTypingUsers(prev =>
        isTyping
          ? [...prev.filter(u => u !== typingUser), typingUser]
          : prev.filter(u => u !== typingUser)
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
    // Stop typing
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
    // Typing indicator logic
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

  const typingText = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : typingUsers.length > 1
    ? `${typingUsers.join(', ')} are typing...`
    : '';

  return (
    <Box sx={{ height: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' }, gridTemplateRows: 'auto 1fr auto', gap: 0 }}>
      {/* Header */}
      <AppBar position="static" sx={{
        gridColumn: '1 / -1',
        background: 'linear-gradient(135deg, #161b22 0%, #1f6feb 50%, #0d1117 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid #30363d',
        boxShadow: '0 8px 24px rgba(31, 111, 235, 0.2)'
      }}>
        <Toolbar sx={{ py: 2.5, px: { xs: 2, md: 3 } }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{
              fontSize: '1.4rem',
              letterSpacing: '-0.5px',
              color: '#79c0ff',
              mb: 0.5
            }}>
              💬 Chat Room
            </Typography>
            <Typography variant="caption" sx={{ color: '#8b949e', fontSize: '0.75rem' }}>
              Experiment 2.3.3
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title={`You are: ${username}`}>
              <Chip
                icon={<Badge overlap="circular" variant="dot" sx={{ '& .MuiBadge-badge': { backgroundColor: '#10b981' } }}><span style={{fontSize: '1.2rem'}}>👤</span></Badge>}
                label={username}
                sx={{
                  background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              />
            </Tooltip>

            <Tooltip title={`${onlineUsers.length} users online`}>
              <Chip
                icon={<PeopleIcon />}
                label={onlineUsers.length}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #238636 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              />
            </Tooltip>

            <Tooltip title="Leave chat">
              <IconButton
                color="inherit"
                onClick={handleLeave}
                sx={{
                  color: '#ff6b6b',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.15)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar: Online Users List */}
      <Box sx={{
        display: { xs: 'none', sm: 'flex' },
        gridColumn: '1',
        gridRow: '2',
        flexDirection: 'column',
        width: '240px',
        background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
        borderRight: '1px solid #30363d',
        overflowY: 'auto',
        overflowX: 'hidden',
        p: 2
      }}>
        <Typography variant="subtitle2" sx={{
          color: '#79c0ff',
          fontWeight: 'bold',
          mb: 2,
          fontSize: '0.85rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          🔌 Active Users
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {onlineUsers.length === 0 ? (
            <Typography variant="caption" sx={{ color: '#8b949e', italic: true }}>
              No one else online
            </Typography>
          ) : (
            onlineUsers.map(user => (
              <Box key={user} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                backgroundColor: '#0d1117',
                borderRadius: '8px',
                border: user === username ? '1px solid #58a6ff' : '1px solid #30363d',
                transition: 'all 0.3s ease',
                cursor: 'default',
                '&:hover': {
                  borderColor: '#58a6ff',
                  backgroundColor: '#161b22'
                }
              }}>
                <Badge overlap="circular" variant="dot" sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 0 2px #0d1117'
                  }
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {user.charAt(0).toUpperCase()}
                  </Box>
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{
                    color: user === username ? '#79c0ff' : '#c9d1d9',
                    fontWeight: user === username ? 600 : 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8b949e', display: 'block' }}>
                    {user === username ? '(You)' : 'Online'}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Messages area */}
      <Box sx={{
        gridColumn: { xs: '1', sm: '2' },
        gridRow: '2',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        p: { xs: 2, md: 3 }
      }}>
        {messages.length === 0 && (
          <Box textAlign="center" my="auto">
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>👋</Typography>
            <Typography variant="h6" sx={{ color: '#c9d1d9', mb: 1 }}>Welcome to the Chat Room!</Typography>
            <Typography sx={{ color: '#8b949e' }}>Start a conversation - say hello!</Typography>
          </Box>
        )}

        {messages.map((msg) =>
          msg.type === 'system' ? (
            <SystemMessage key={msg.id} text={msg.text} timestamp={msg.timestamp} />
          ) : (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.username === username} />
          )
        )}

        {/* Typing indicator */}
        {typingText && (
          <Box display="flex" alignItems="center" gap={1} ml={1} mb={1.5} sx={{ animation: 'fadeInUp 0.3s ease-out', '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
            <Typography variant="caption" sx={{ color: '#58a6ff', fontStyle: 'italic', fontWeight: 500,  fontSize: '0.85rem' }}>
              {typingText}
            </Typography>
            <Box display="flex" gap={0.4}>
              {[0, 1, 2].map(i => (
                <Box key={i} sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #58a6ff 0%, #1f6feb 100%)',
                  animation: 'bounce 1.4s infinite',
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 2px 8px rgba(88, 166, 255, 0.4)',
                  '@keyframes bounce': {
                    '0%, 80%, 100%': { transform: 'scale(0.5)' },
                    '40%': { transform: 'scale(1)' },
                  }
                }} />
              ))}
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider sx={{ gridColumn: '1 / -1', borderColor: '#30363d' }} />

      {/* Message input */}
      <Paper elevation={4} sx={{
        gridColumn: { xs: '1', sm: '2' },
        gridRow: '3',
        background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
        borderTop: '2px solid #30363d',
        borderRadius: 0,
        p: 2.5
      }}>
        <Box display="flex" gap={1.5} alignItems="flex-end">
          <TextField
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            fullWidth
            multiline
            maxRows={4}
            size="small"
            variant="outlined"
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0d1117',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                border: '1px solid #30363d',
                '&:hover': { borderColor: '#58a6ff' },
                '&.Mui-focused': {
                  borderColor: '#58a6ff',
                  boxShadow: '0 0 0 3px rgba(88, 166, 255, 0.15)'
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#c9d1d9',
                '&::placeholder': { color: '#8b949e', opacity: 0.7 }
              },
            }}
          />
          <Tooltip title={input.trim() ? 'Send message (Enter)' : 'Type a message first'}>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{
                transition: 'all 0.3s ease',
                background: input.trim() ? 'linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)' : 'rgba(31, 111, 235, 0.3)',
                color: 'white',
                borderRadius: '8px',
                p: 1.5,
                minWidth: '44px',
                '&:hover:not(:disabled)': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 20px rgba(31, 111, 235, 0.4)'
                },
                '&:disabled': {
                  background: 'rgba(31, 111, 235, 0.2)',
                  cursor: 'default'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
}
