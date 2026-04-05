# Experiment 2.3.1 – React-Express Integration with Axios

## Aim
Connect React frontend to fetch data from Express API using Axios.

## Setup & Run

### Backend
```bash
cd backend
npm install
node server.js        # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start             # Runs on http://localhost:3000
```

> Make sure MongoDB is running locally or update MONGO_URI in backend/server.js.

## Features
- GET /api/products — fetch all products (auto-seeds if empty)
- POST /api/products — create a product
- DELETE /api/products/:id — delete a product
- Loading spinner during fetch
- Error alert with retry button
- Responsive Bootstrap card grid
