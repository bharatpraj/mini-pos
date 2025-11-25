# Online Ordering App (Angular)

A full-featured **Online Ordering Web Application** built using
**Angular + TailwindCSS**, powered by a **NestJS backend** with
**Firestore database**, and **WebSockets** for real-time order status
updates.

------------------------------------------------------------------------

## Features

### Customer Authentication

-   Customer **Signup**
-   Customer **Login**
-   Stores customer session securely in browser

------------------------------------------------------------------------

## Product Browsing

Customers can: - View all products - Filter products by category - View
product details - Add/remove items from cart

------------------------------------------------------------------------

## Cart & Checkout

-   Real-time cart updates using Angular services
-   Customer fills **delivery address**
-   Customer selects **payment method**
-   Place order → Stored in Firestore via NestJS REST API

------------------------------------------------------------------------

## Order Tracking (with WebSockets)

After placing an order: - Customer sees **My Orders** - Each order shows
live status: - Pending
- Confirmed
- Preparing
- Out for Delivery
- Delivered
- Updates arrive instantly via WebSocket --- no refresh required.

------------------------------------------------------------------------

## 🔌 Technology Stack

### Frontend (Angular)

-   Angular 20+ Standalone Components
-   TailwindCSS
-   RxJS for state handling
-   WebSocket client
-   Services for API + real-time event handling

### Backend (NestJS)

-   Firestore database
-   Firebase Authentication
-   REST APIs (products, orders, cart)
-   WebSocket Gateway
-   Real-time broadcasting

------------------------------------------------------------------------

## Project Structure

    src/
     ├── app/
     │    ├── core/
     │    │     ├── models/
     │    │     │      ├── cart-item.model.ts
     │    │     │      ├── menu-item.model.ts
     │    │     │      ├── order.model.ts
     │    │     │      └── user.model.ts
     │    │     ├── services/
     │    │     │      ├── auth.service.ts
     │    │     │      ├── cart.service.ts
     │    │     │      ├── menu.service.ts
     │    │     │      ├── orders.service.ts
     │    │     │      └── websocket.service.ts
     │    ├── features/
     │    │     ├── auth/
     │    │     │      ├── login/
     │    │     │      └── signup/
     │    │     ├── products/
     │    │     ├── orders/
     │    │     └── cart/
     │    ├── app.routes.ts
     │    └── app.config.ts

------------------------------------------------------------------------

## 🔌 How REST + WebSocket Work Together

### Customer places an order (REST)

Angular → NestJS

    POST /orders

Order saved to Firestore.

------------------------------------------------------------------------

### Restaurant staff updates status

    PATCH /orders/:id

------------------------------------------------------------------------

### Backend broadcasts WebSocket event

NestJS Gateway:

``` ts
this.server.emit('order-status-shanged', updatedOrder);
```

------------------------------------------------------------------------

###  Angular listens for updates

``` ts
this.websocket.listen('order-status-shanged')
  .subscribe(order => this.updateOrderList(order));
```

UI updates instantly.

------------------------------------------------------------------------

## Run the App

### Install packages

    npm install

### Start Angular app

    ng serve

### Start NestJS backend

    npm run start:dev

------------------------------------------------------------------------

## Environment Setup

### Angular `environment.ts`

``` ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  wsUrl: 'ws://localhost:3000',
  firebase: {
      apiKey: "<API_KAY>",
      authDomain: "<AUTH_DOMAIN>",
      projectId: "<PROJECT_ID>",
      storageBucket: "STORAGE_BUCKET",
      messagingSenderId: "M_SENDER_ID",
      appId: "APP_ID",
      measurementId: "MEASUREMENT_ID"
  }
};
```


------------------------------------------------------------------------