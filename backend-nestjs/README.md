# backend-nestjs

A lightweight NestJS backend for handling orders, syncing them in
real-time using WebSockets, and storing everything in Firebase
Firestore.

## Features

-   Create, update, and fetch orders
-   Firestore database integration
-   Real-time live order updates using WebSockets
-   Swagger API documentation
-   Fully typed using DTOs

## Project Setup

### 1. Install Dependencies

``` bash
npm install
```

### 2. Create `.env` File

Example:

    PORT=3000
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_CLIENT_EMAIL=your_service_account_email
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
    ABC...
    -----END PRIVATE KEY-----
    "

## Start the Server

### Development

``` bash
npm run start:dev
```
### Production

``` bash
npm run build
npm start
```
## Docker Commands (Optional)

### Build & Run

``` bash
docker compose up --build
```

### Run in Background

``` bash
docker compose up -d
```
### Stop

``` bash
docker compose down

```

## Swagger API Docs

Once the server is running:

    http://localhost:3000/api-docs

## REST Endpoints Overview

    http://localhost:3000/api/v1

### Create Order

    POST /orders

Body:

``` json
{
  "source": "POS",
  "createdBy": "admin",
  "items": [
    { "sku": "coffee", "qty": 2 }
  ],
  "notes": ""
}
```

### Get All Orders

    GET /orders

### Get Order By ID

    GET /orders/:id

### Update Order

    PATCH /orders/:id

## Real-Time Sync (WebSockets)

Whenever an order is created or updated, the server broadcasts updates
instantly to all connected clients.

### WebSocket Event Names:

-   `order_created`
-   `order_status_changed`

Example:

``` javascript
socket.on('orderCreated', (order) => {
  console.log("New live order:", order);
});
```

## DTOs

### CreateOrderDto

``` ts
export class CreateOrderDto {
  source: 'POS' | 'online';
  createdBy: string;
  items: { sku: string; qty: number }[];
  notes?: string;
}
```

### UpdateOrderDto

``` ts
export class UpdateOrderDto {
  status?: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  notes?: string;
}
```

## Project Structure

    src/
      modules/
        orders/
          orders.controller.ts
          orders.service.ts
          dto/
            create-order.dto.ts
            update-order.dto.ts
        websocket/
          events.gateway.ts
      firebase/
        firebase.service.ts
    main.ts
