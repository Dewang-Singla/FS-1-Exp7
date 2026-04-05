# Experiment 2.3 - Full Stack I

This repository contains both:

1. Individual experiment implementations in separate folders.
2. A combined integrated implementation at the project root.

## Repository Structure

### Individual Experiments

- [2.3.1](2.3.1): React + Axios + Express + MongoDB (Products CRUD)
- [2.3.2](2.3.2): Redux Shopping Cart (Frontend only)
- [2.3.3](2.3.3): Real-Time Chat (Socket.IO)

Each folder above can be run independently as its own experiment.

### Combined Integrated Project

- [backend](backend): Unified Express + MongoDB + Socket.IO server
- [frontend](frontend): Unified React app with routing for Products, Cart, and Chat

This root-level setup combines all three experiments into one deployable full-stack application.

## Run Individual Experiments

### 2.3.1 (Standalone)

```bash
cd 2.3.1/backend
npm install
npm run dev

cd ../frontend
npm install
npm start
```

### 2.3.2 (Standalone)

```bash
cd 2.3.2
npm install
npm start
```

### 2.3.3 (Standalone)

```bash
cd 2.3.3/backend
npm install
npm run dev

cd ../frontend
npm install
npm start
```

## Run Combined Root Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Backend [.env](backend/.env)

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- FRONTEND_URL=http://localhost:3000

### Frontend [.env](frontend/.env)

- REACT_APP_API_BASE_URL=http://localhost:5000

## Notes

- If you only want to evaluate each experiment separately, use [2.3.1](2.3.1), [2.3.2](2.3.2), and [2.3.3](2.3.3).
- If you want a single integrated submission/deployment, use [backend](backend) and [frontend](frontend) at the root.
