
# Pos App (POS + Orders Dashboard)

This project follows a clean **Core + Features** architecture and supports **real‑time order syncing** using WebSockets.

---

# Features

✅ POS Screen  
✅ Orders Dashboard  
✅ Login Flow  
✅ Firebase-Ready WebSocket Sync  
✅ Clean architecture (Core + Features)  
✅ Reusable Services & Models  

---

# Project Structure

```
src/app
│
├── core
│   ├── guards
│   │   └── auth.guard.ts
│   ├── layout
│   │   ├── footer.component.html
│   │   ├── footer.component.ts
│   │   ├── header.component.html
│   │   └── header.component.ts
│   ├── models
│   │   ├── cart-item.model.ts
│   │   ├── menu-item.model.ts
│   │   ├── order.model.ts
│   │   └── user.model.ts
│   └── services
│       ├── auth.service.ts
│       ├── cart.service.ts
│       ├── menu.service.ts
│       ├── orders.service.ts
│       └── websocket.service.ts
│
├── features
│   ├── auth
│   │   └── login
│   │       ├── login.component.ts
│   │       ├── login.component.html
│   │       ├── login.component.css
│   │       └── login.component.spec.ts
│   ├── orders
│   │   ├── orders.component.ts
│   │   ├── orders.component.html
│   │   ├── orders.component.css
│   │   └── orders.component.spec.ts
│   └── pos
│       ├── pos.component.ts
│       ├── pos.component.html
│       ├── pos.component.css
│       └── pos.component.spec.ts
│
└── app.config.server.ts
```

---

# ⚡ Real-Time Sync (WebSocket)

This Angular app listens to real-time updates from the backend.

### 🔌 How it Works

1. Backend (NestJS) emits `"order_status_changed"` and `"order_created"` events using WebSockets.
2. Frontend uses **WebSocketService** to subscribe.
3. UI updates instantly without refresh.

### Example WebSocket listener (frontend):

```ts
this.websocket.listen('order_created').subscribe(order => {
  this.orders.push(order);
});

this.websocket.listen('order_status_changed').subscribe(updated => {
  this.orders = this.orders.map(o =>
    o.id === updated.id ? updated : o
  );
});
```

---

#  Environment Setup

Create a file:

```
src/environments/environment.ts
```

Example:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  websocketUrl: 'ws://localhost:3000',
};
```

For production:

```
src/environments/environment.prod.ts
```

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com',
  websocketUrl: 'wss://your-api.com',
};
```

---

# Installation

```bash
npm install
```

---

# Running the App

```bash
ng serve
```

Runs at:  
👉 http://localhost:4200

---
