# Backend Microservices

This directory contains the backend source code for the Food Delivery Platform. It is a collection of independent microservices built with Node.js and Express, communicating via Apache Kafka.

## 🛠️ Technical Architecture

### Tech Stack
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Messaging:** Apache Kafka (using `kafkajs`)
*   **Architecture Pattern:** Microservices with **Service Layer** pattern.

### Service Layer Pattern
All services have been refactored to separate business logic from HTTP handling:
*   **Controllers (`/controllers`)**: Handle HTTP requests, validate inputs (basic), call Service methods, and send responses.
*   **Services (`/services`)**: Contain core business logic, complex validations, database interactions, and event publishing.
*   **Repositories (`/repositories`)**: Handle direct database queries (Mongoose).

## 📦 Microservices

### 1. User Service
*   **Port:** 5005 (mapped)
*   **Database:** `user_service` (MongoDB)
*   **Responsibilities:**
    *   User Registration & Login (JWT)
    *   User Profile Management
    *   Address Management
    *   Cart Management

### 2. Order Service
*   **Port:** 5001 (mapped)
*   **Database:** `order_service` (MongoDB)
*   **Responsibilities:**
    *   Order creation and validation
    *   Order lifecycle management (pending -> confirmed -> delivered)
    *   Publishes `ORDER_CREATED` events

### 3. Restaurant Service
*   **Port:** 5006 (mapped)
*   **Database:** `restaurant_service` (MongoDB)
*   **Responsibilities:**
    *   Restaurant Profile & Status (Open/Close) management
    *   Menu Management (Items, Availability)
    *   Kitchen Order View & "Ready" marking
    *   Authorization middleware for owners

### 4. Delivery Service
*   **Port:** 5004 (mapped)
*   **Database:** `delivery_service` (MongoDB)
*   **Responsibilities:**
    *   Driver Management (Availability, Stats)
    *   Auto-Assignment Logic (triggered by `FOOD_READY`)
    *   Delivery Tracking (Pickup, Complete)

### 5. Payment Service
*   **Port:** 5002 (mapped)
*   **Database:** `payment_service` (MongoDB)
*   **Responsibilities:**
    *   Stripe Payment Intent creation
    *   Webhook handling (`payment_success` / `payment_failed`)
    *   Publishes `PAYMENT_PROCESSED` events

### 6. Notification Service
*   **Port:** 5003 (mapped)
*   **Database:** N/A (Stateless/Log-based)
*   **Responsibilities:**
    *   Consumes all relevant Kafka topics
    *   Simulates sending SMS/Email notifications via logs

## 🔌 API Standardization
All APIs have been standardized to return camelCase responses.
*   **Primary Keys:** All entities return `id` (string) as their primary identifier (mapped from MongoDB `_id`).
*   **Foreign Keys:** Fields like `restaurantId`, `orderId`, `userId` are preserved as camelCase strings.

## 🐳 Infrastructure
The `docker-compose.yml` file in this directory handles the local development infrastructure:
*   **Zookeeper & Kafka:** For event streaming.
*   **MongoDB:** Single instance hosting all service databases.

### Running Infrastructure
```bash
docker-compose up -d
```

### Seeding Data
```bash
npm run seed
```
This script populates MongoDB with initial users, restaurants, menu items, and drivers.