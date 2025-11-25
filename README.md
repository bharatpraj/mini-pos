# Mini POS -- Open Source Point of Sale

A lightweight and modular Point of Sale (POS) system with three complete
apps, all updated with proper environment setup, clean architecture, and
documentation.

------------------------------------------------------------------------

## Project Structure

    mini-pos/
    │
    ├── backend-nestjs/        # Backend API using NestJS
    │
    ├── pos-app/               # POS application (Cashier UI)
    │
    ├── online-ordering-app/   # Customer online ordering app
    │
    └── videos/                # Demo videos and walkthroughs

------------------------------------------------------------------------

## Features

### Backend (NestJS)

-   Modular architecture
-   Authentication
-   Products & Inventory
-   Orders & Billing APIs
-   Environment-based config

### POS App

-   Cashier dashboard
-   Add/remove items
-   Auto total calculation
-   Order summary & receipt

### Online Ordering App

-   Browse products
-   Add to cart
-   Checkout
-   Mobile-friendly

------------------------------------------------------------------------

## Tech Stack

  Layer             Technology
  ----------------- ---------------------
  Backend           NestJS, TypeScript
  POS App           Angular / TypeScript
  Online Ordering   Angular / TypeScript
  Tools             GitHub, ENV configs

------------------------------------------------------------------------

## Documentation

Each module includes: - Setup instructions
- Sample `.env` files
- Folder structure
- API documentation

------------------------------------------------------------------------

## How to Run

### 1. Clone the Repository

``` bash
git clone https://github.com/<username>/mini-pos.git
cd mini-pos
```

### 2. Install Dependencies

Inside each module:

``` bash
npm install
```

### 3. Start Backend

``` bash
npm run start:dev
```

### 4. Start POS App

``` bash
npm start
```

### 5. Start Online Ordering App

``` bash
npm start
```

------------------------------------------------------------------------

## Open Source

This project is open for contribution.
Feel free to fork, enhance, and submit PRs.
