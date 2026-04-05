import React, { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import LoginScreen from './components/LoginScreen';
import ChatRoom from './components/ChatRoom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

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

export default function App() {
  const [username, setUsername] = useState(null);
  const socket = useSocket();

  const handleJoin = (name) => {
    socket.connect();
    socket.emit('user:join', name);
    setUsername(name);
  };

  const handleLeave = () => {
    setUsername(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {!username ? (
        <LoginScreen onJoin={handleJoin} />
      ) : (
        <ChatRoom socket={socket} username={username} onLeave={handleLeave} />
      )}
    </ThemeProvider>
  );
}
