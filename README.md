# Experiment 2.3 – Full Stack Integration (MERN)
### Course: CONT_24CSP-293 | Full Stack-I

---

## Sub-Experiments

| Experiment | Topic | Port (Backend) | Port (Frontend) |
|------------|-------|---------------|-----------------|
| 2.3.1 | React-Express Integration with Axios | 5000 | 3000 |
| 2.3.2 | Redux Shopping Cart | — (frontend only) | 3000 |
| 2.3.3 | Real-Time Chat with Socket.IO | 5001 | 3000 |

---

## Quick Start

### Experiment 2.3.1
```bash
cd 2.3.1/backend && npm install && node server.js
cd 2.3.1/frontend && npm install && npm start
```
**Requires:** MongoDB running locally (or update MONGO_URI in backend/server.js)

### Experiment 2.3.2
```bash
cd 2.3.2 && npm install && npm start
```
**No backend needed** — Redux state with localStorage persistence.

### Experiment 2.3.3
```bash
cd 2.3.3/backend && npm install && node server.js
cd 2.3.3/frontend && npm install && npm start
```
Open multiple browser tabs to test multi-user chat.

---

## Viva Voce Quick Answers

### 2.3.1
1. **Axios vs fetch**: Axios auto-parses JSON, has interceptors, better error handling, request cancellation.
2. **CORS**: Cross-Origin Resource Sharing — handled in Express via `cors` middleware.
3. **useEffect cleanup**: Returns a function to cancel subscriptions/timers to prevent memory leaks.
4. **JWT**: Sign token on login, send in `Authorization: Bearer <token>` header, verify in Express middleware.
5. **React hooks rules**: Only call at top level, only in React functions, never in loops/conditions.

### 2.3.2
1. **Redux Toolkit advantages**: Less boilerplate, built-in Immer (mutable syntax), createSlice, RTK Query.
2. **Redux middleware**: Functions between dispatch and reducer — used for logging, async (thunk), side effects.
3. **Redux DevTools**: Time-travel debugging, action/state inspection, diff viewer.
4. **Async actions**: Use `createAsyncThunk` from Redux Toolkit for API calls.
5. **Selector functions**: Pure functions that extract derived data from Redux state efficiently (e.g., `reselect`).

### 2.3.3
1. **WebSockets vs HTTP**: WebSockets = full-duplex persistent TCP; HTTP = half-duplex request-response.
2. **Socket.IO fallback**: Falls back to HTTP long-polling when WebSockets are blocked by proxies/firewalls.
3. **Reconnection**: Socket.IO retries with exponential backoff automatically; customise via `reconnectionDelay`.
4. **Rooms**: Named channels — `socket.join('room')` / `io.to('room').emit(...)` for targeted broadcast.
5. **Private messaging**: Create a room per pair of users, route messages to that room only.
