import React, { useState } from 'react';
import LoginScreen from '../components/LoginScreen';
import ChatRoom from '../components/ChatRoom';
import { useSocket } from '../hooks/useSocket';

export default function ChatPage() {
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

  return !username ? (
    <LoginScreen onJoin={handleJoin} />
  ) : (
    <ChatRoom socket={socket} username={username} onLeave={handleLeave} />
  );
}
