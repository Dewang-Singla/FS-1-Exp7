# Experiment 2.3.3 – Real-Time Chat with Socket.IO

## Aim
Develop a real-time chat application using WebSocket connections with Socket.IO.

## Setup & Run

### Backend (Socket.IO Server)
```bash
cd backend
npm install
node server.js        # Runs on http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
npm start             # Runs on http://localhost:3000
```

## Testing Multi-User Chat
Open http://localhost:3000 in **two or more browser tabs/windows** and join with different usernames to test real-time messaging.

## Features
- Real-time bidirectional messaging via Socket.IO
- Username login screen
- System notifications on join/leave
- Live typing indicators with animated dots
- Online user list with live updates
- Auto-scroll to latest message
- Own messages shown on the right (blue), others on left
- Avatar initials with unique colours per user
- Socket cleanup on component unmount (useEffect)
