# 🛒 Supermarket Management System

A full-stack project simulating a supermarket chain's Cash Register and Analytics system.

## Overview

The solution includes:

- **Cash Register Service** (FastAPI) – handles purchases, customers, and products
- **Analytics Service** (FastAPI) – provides insights into unique customers, loyal customers, and top-selling products
- **Frontend** (TypeScript + Vite) – user-friendly interface
- **PostgreSQL database** shared across services
- **Docker Compose** orchestration for easy deployment

## Features

### 🧾 Cash Register Service

- Create purchases
- Select new or existing customers
- Auto-generate customer IDs
- Searchable customer dropdown
- Product grid with one-of-each product selection
- Calculates purchase total

### 📊 Analytics Service

- Unique customers per supermarket
- Loyal customers with pagination
- Top-selling product per branch
- Optimized SQL queries

### 🖥 Frontend

- Three-page navigation:
  - Home
  - Cash Register Simulator
  - Analytics Dashboard
- Very simple UI aimed at non-technical supermarket owners
- Highlighted active actions
- Pagination controls
- Clean layout

### 🗄 PostgreSQL Database

- Shared between both services
- Auto-migrated tables
- Auto-loaded sample CSV data on startup

## 🐳 Running the System with Docker

### 1. Clone the repository

```bash
git clone https://github.com/ogitc/supermarket-excercise
cd supermarket-excercise
```

### 2. Build and run everything

```bash
docker-compose up --build
```

All services will start automatically.

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend UI | http://localhost:5173 |
| Cash Register API | http://localhost:8001/docs |
| Analytics API | http://localhost:8002/docs |
| PostgreSQL | localhost:5432 |

## 🔧 Environment Variables

Defaults from `docker-compose.yml`:

- `POSTGRES_USER`: supermarket
- `POSTGRES_PASSWORD`: supermarket
- `POSTGRES_DB`: supermarketdb

Backend services use:

```bash
DATABASE_URL=postgresql://supermarket:supermarket@supermarket-db:5432/supermarketdb
```

## 🧪 Development Without Docker

### Backend Services

**Cash Register Service:**

```bash
cd cash-register-service
uvicorn main:app --reload
```

**Analytics Service:**

```bash
cd analytics-service
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📘 API Documentation

FastAPI Swagger UIs:

- **Cash Register** → http://localhost:8001/docs
- **Analytics** → http://localhost:8002/docs

## 📈 Architecture Overview

The system follows a microservices architecture with:

- Two independent FastAPI services sharing a PostgreSQL database
- A frontend application consuming both APIs
- Docker Compose for orchestration and easy deployment

![Architecture Diagram](Diagram.jpg)

## 📦 CSV Auto-Loading

When the Cash Register service starts, it automatically:

- Creates tables (if needed)
- Loads:
  - `products_list.csv`
  - `purchases.csv`

This ensures the system works immediately with demo data.

## 🛠 Technologies Used

### Backend

- Python 3.12
- FastAPI
- SQLAlchemy
- Psycopg2
- Uvicorn

### Frontend

- TypeScript
- Vite
- Modular DOM components

### Infrastructure

- Docker & Docker Compose
- PostgreSQL
