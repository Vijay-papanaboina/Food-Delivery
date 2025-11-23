# 🍔 Food Delivery Platform - Full Stack Microservices

A production-ready, full-stack food delivery platform built with modern microservices architecture. This monorepo contains 6 backend microservices and 3 frontend applications for Customers, Restaurants, and Delivery Drivers.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)
[![Kafka](https://img.shields.io/badge/Kafka-Latest-black.svg)](https://kafka.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#%EF%B8%8F-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🌟 Project Overview

This comprehensive food delivery platform demonstrates enterprise-grade software architecture with:

- **Event-Driven Microservices:** 6 independent services communicating via Apache Kafka
- **Multi-User Applications:** Separate frontends for Customers, Restaurants, and Drivers
- **Real-Time Updates:** Live order tracking and status updates
- **Payment Processing:** Integrated Stripe payment gateway
- **Production-Ready:** Docker containerization and Kubernetes deployment configs

### **Use Cases**

✅ **Customers:** Browse restaurants, order food, track delivery in real-time  
✅ **Restaurants:** Manage menus, receive orders, update kitchen status  
✅ **Drivers:** Accept deliveries, update pickup/delivery status, track earnings  

## 🏗️ Architecture

### **System Design**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Customer App   │     │ Restaurant App  │     │  Courier App    │
│  (React/TS)     │     │  (React/TS)     │     │  (React/TS)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   API Gateway (NGINX)   │
                    │   or Direct Service     │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼────────────────────────┐
         │                       │                        │
    ┌────▼─────┐    ┌───────────▼──────────┐    ┌───────▼──────┐
    │   User   │    │       Order          │    │   Payment    │
    │ Service  │    │      Service         │    │   Service    │
    └────┬─────┘    └───────────┬──────────┘    └───────┬──────┘
         │                      │                        │
         │          ┌───────────▼──────────┐            │
         │          │    Restaurant        │            │
         │          │      Service         │            │
         │          └───────────┬──────────┘            │
         │                      │                        │
         │          ┌───────────▼──────────┐            │
         │          │     Delivery         │            │
         │          │      Service         │            │
         │          └───────────┬──────────┘            │
         │                      │                        │
         └──────────────────────┼────────────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │  Notification        │
                    │    Service           │
                    └──────────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
    ┌────▼─────┐    ┌──────────▼────────┐    ┌───────▼──────┐
    │ MongoDB  │    │  Apache Kafka      │    │   Stripe     │
    │          │    │  (Event Bus)       │    │     API      │
    └──────────┘    └────────────────────┘    └──────────────┘
```

### **Services Overview**

| Component | Port | Technology | Database | Description |
|-----------|------|------------|----------|-------------|
| **User Service** | 5005 | Node.js + Express | MongoDB | Authentication, profiles, cart management |
| **Order Service** | 5001 | Node.js + Express | MongoDB | Order creation, lifecycle, orchestration |
| **Payment Service** | 5002 | Node.js + Express | MongoDB | Stripe integration, payment processing |
| **Restaurant Service** | 5006 | Node.js + Express | MongoDB | Menu management, kitchen operations |
| **Delivery Service** | 5004 | Node.js + Express | MongoDB | Driver assignment, delivery tracking |
| **Notification Service** | 5003 | Node.js + Express | In-Memory | Event-driven notifications |
| **Customer Frontend** | 5173 | React 19 + Vite | - | Customer-facing application |
| **Restaurant Frontend** | 5174 | React 19 + Vite | - | Restaurant management dashboard |
| **Courier Frontend** | 5175 | React 19 + Vite | - | Driver delivery management |

## 🛠️ Tech Stack

### **Backend**
*   **Runtime:** Node.js 20.x
*   **Framework:** Express.js 4.x/5.x
*   **Database:** MongoDB 5.0+ (Mongoose ODM)
*   **Message Broker:** Apache Kafka (KafkaJS)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Payment:** Stripe API
*   **Logging:** Winston
*   **Validation:** express-validator

### **Frontend**
*   **Framework:** React 19.1.1
*   **Build Tool:** Vite 7 (Rolldown)
*   **Language:** TypeScript 5.9.3
*   **Styling:** Tailwind CSS 4.1.14
*   **UI Components:** Shadcn UI (Radix)
*   **State Management:** Zustand 5.0.8
*   **Data Fetching:** TanStack Query 5.90.5
*   **Routing:** React Router DOM 7.9.4
*   **HTTP Client:** Axios

### **Infrastructure**
*   **Containerization:** Docker
*   **Orchestration:** Docker Compose, Kubernetes
*   **Message Queue:** Apache Kafka + Zookeeper
*   **Database:** MongoDB (containerized)

## 🚀 Quick Start

### **Prerequisites**

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### **Option 1: Automated Setup (Recommended)**

```bash
# Install all dependencies (uses npm workspaces)
npm install

# Start infrastructure (MongoDB, Kafka, Zookeeper)
npm run infra:up

# Wait for infrastructure to be ready
npm run db:wait

# Seed database with test data
npm run db:seed

# Start all services (backend + frontend)
npm run dev
```

After a few moments, access:
- Customer App: http://localhost:5173
- Restaurant App: http://localhost:5174
- Courier App: http://localhost:5175

### **Option 2: Manual Setup**

<details>
<summary>Click to expand manual setup instructions</summary>

#### 1. Start Infrastructure

```bash
cd Food-Delivery-Backend
docker-compose up -d
```

#### 2. Seed Database

```bash
node seed-mongodb.mjs
```

#### 3. Start Backend Services (6 terminals)

```bash
# Terminal 1
cd Food-Delivery-Backend/user-service && npm install && npm run dev

# Terminal 2
cd Food-Delivery-Backend/order-service && npm install && npm run dev

# Terminal 3
cd Food-Delivery-Backend/payment-service && npm install && npm run dev

# Terminal 4
cd Food-Delivery-Backend/restaurant-service && npm install && npm run dev

# Terminal 5
cd Food-Delivery-Backend/delivery-service && npm install && npm run dev

# Terminal 6
cd Food-Delivery-Backend/notification-service && npm install && npm run dev
```

#### 4. Start Frontend Applications (3 terminals)

```bash
# Terminal 7
cd Food-Delivery-Customer-Frontend && npm install && npm run dev

# Terminal 8
cd Food-Delivery-Restaurant-Frontend && npm install && npm run dev

# Terminal 9
cd Food-Delivery-Courier-Frontend && npm install && npm run dev
```

</details>

### **Available NPM Scripts**

| Script | Description |
|--------|-------------|
| `npm run dev` | **Start everything** (infra + seed + all services) |
| `npm run dev:backend` | Start all backend services only |
| `npm run dev:frontend` | Start all frontend apps only |
| `npm run infra:up` | Start MongoDB and Kafka containers |
| `npm run infra:down` | Stop infrastructure containers |
| `npm run infra:logs` | View infrastructure logs |
| `npm run db:seed` | Seed database with test data |

## 📁 Project Structure

```
food-delivery-platform/
├── Food-Delivery-Backend/           # Backend microservices
│   ├── user-service/                # User authentication & profiles
│   ├── order-service/               # Order management & orchestration
│   ├── payment-service/             # Stripe payment processing
│   ├── restaurant-service/          # Restaurant & menu management
│   ├── delivery-service/            # Driver & delivery management
│   ├── notification-service/        # Event-driven notifications
│   ├── docker-compose.yml           # Infrastructure (Kafka, MongoDB)
│   ├── seed-mongodb.mjs             # Database seeding script
│   └── README.md                    # Backend documentation
│
├── Food-Delivery-Customer-Frontend/ # Customer-facing app
│   ├── src/
│   ├── public/
│   └── README.md
│
├── Food-Delivery-Restaurant-Frontend/ # Restaurant dashboard
│   ├── src/
│   ├── public/
│   └── README.md
│
├── Food-Delivery-Courier-Frontend/  # Driver delivery app
│   ├── src/
│   ├── public/
│   └── README.md
│
├── k8s/                             # Kubernetes deployment configs
│   ├── deployments/
│   ├── services/
│   └── ingress/
│
├── build-docker-images.sh           # Build all Docker images
├── start-all-services.ps1           # Windows startup script
├── package.json                     # Root npm workspaces config
└── README.md                        # This file
```

## ✨ Features

### **Customer Experience**
- 🔍 Browse restaurants by cuisine, rating, delivery time
- 🛒 Add items to cart with real-time price updates
- 💳 Secure checkout with Stripe integration
- 📍 Multiple delivery address management
- 📦 Real-time order tracking with status updates
- 📜 Order history and receipts
- 👤 Profile management

### **Restaurant Operations**
- 📋 Menu management (CRUD operations)
- 🍕 Item availability toggles
- 🏪 Restaurant open/close status control
- 🍳 Kitchen order view (real-time)
- ✅ Accept and mark orders as ready
- 📊 Daily stats (revenue, order count)

### **Driver Features**
- 🚗 Toggle availability (online/offline)
- 📬 Accept or decline delivery assignments
- 📍 View pickup and delivery addresses
- ✅ Update delivery status (picked up, delivered)
- 💰 Track earnings per delivery
- 📈 View delivery history and statistics

### **Technical Features**
- ⚡ Event-driven architecture with Kafka
- 🔐 JWT-based authentication with refresh tokens
- 🔒 Role-based access control (customer, restaurant, driver)
- 📱 Responsive design (mobile-first for courier app)
- 🎨 Dark mode support
- 🐳 Docker containerization
- ☸️ Kubernetes-ready deployments
- 🔄 Automatic driver assignment algorithm
- 📧 Notification system (email/SMS simulation)

## 📚 Documentation

### **Component Documentation**
Each component has detailed documentation in its respective directory:

#### Backend Services
- [Backend Overview](./Food-Delivery-Backend/README.md) - Architecture, Kafka topics, quick start
- [User Service](./Food-Delivery-Backend/user-service/README.md) - Authentication, profiles, cart API
- [Order Service](./Food-Delivery-Backend/order-service/README.md) - Order lifecycle, orchestration
- [Payment Service](./Food-Delivery-Backend/payment-service/README.md) - Stripe integration, webhooks
- [Restaurant Service](./Food-Delivery-Backend/restaurant-service/README.md) - Menu management, kitchen
- [Delivery Service](./Food-Delivery-Backend/delivery-service/README.md) - Driver assignment, tracking
- [Notification Service](./Food-Delivery-Backend/notification-service/README.md) - Event notifications

#### Frontend Applications
- [Customer Frontend](./Food-Delivery-Customer-Frontend/README.md) - User app setup, features
- [Restaurant Frontend](./Food-Delivery-Restaurant-Frontend/README.md) - Dashboard setup, workflows
- [Courier Frontend](./Food-Delivery-Courier-Frontend/README.md) - Driver app setup, mobile-first

#### Deployment
- [Kubernetes Guide](./k8s/README.md) - K8s deployment, ingress, scaling
- [Production Deployment](./PRODUCTION_DEPLOYMENT_GUIDE.md) - Production best practices

## 🧪 Test Accounts

After seeding the database (`npm run db:seed`), use these accounts:

**Customers:**
| Email | Password | Name |
|-------|----------|------|
| `john@example.com` | `password` | John Doe |
| `jane@example.com` | `password` | Jane Smith |

**Restaurant Owners:**
| Email | Password | Restaurant |
|-------|----------|------------|
| `mario@pizzapalace.com` | `password` | Mario's Pizza Palace |
| `burger@junction.com` | `password` | Burger Junction |
| `thai@garden.com` | `password` | Thai Garden |

**Drivers:**
| Email | Password | Name |
|-------|----------|------|
| `sarah.johnson@driver.com` | `password` | Sarah Johnson |
| `john.smith@driver.com` | `password` | John Smith |
| `mike.davis@driver.com` | `password` | Mike Davis |

## 🐳 Deployment

### **Docker Build**

Build all service Docker images:

```bash
# Linux/Mac
./build-docker-images.sh

# Windows
./build-docker-images.ps1
```

### **Kubernetes Deployment**

See the [Kubernetes Guide](./k8s/README.md) for detailed deployment instructions.

Quick deploy:
```bash
cd k8s
kubectl apply -f deployments/
kubectl apply -f services/
kubectl apply -f ingress/
```

## 🧩 Event-Driven Flow

The platform uses Kafka for asynchronous communication between services:

```
Customer Places Order
    ↓ (order-created)
Payment Service Processes Payment
    ↓ (payment-processed)
Order Service Confirms Order
    ↓ (order-confirmed)
Restaurant Service Receives Kitchen Order
    ↓ (food-ready)
Delivery Service Assigns Driver
    ↓ (delivery-assigned)
Driver Picks Up Order
    ↓ (delivery-picked-up)
Driver Delivers Order
    ↓ (delivery-completed)
Order Marked as Delivered
```

**All events** are consumed by Notification Service for real-time updates.

## 🔧 Troubleshooting

<details>
<summary>Services won't start</summary>

1. Ensure Docker is running: `docker ps`
2. Check if ports are available: `netstat -ano | findstr :5001`
3. Verify MongoDB and Kafka are running: `npm run infra:logs`
4. Check individual service logs
</details>

<details>
<summary>Database connection errors</summary>

```bash
# Restart MongoDB
npm run infra:down
npm run infra:up

# Wait for MongoDB to be ready
npm run db:wait

# Re-seed if needed
npm run db:seed
```
</details>

<details>
<summary>Kafka connection issues</summary>

```bash
# View Kafka logs
docker-compose -f Food-Delivery-Backend/docker-compose.yml logs kafka

# Restart Kafka
docker-compose -f Food-Delivery-Backend/docker-compose.yml restart kafka zookeeper
```
</details>

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Payment Processing:** Stripe
- **Message Broker:** Apache Kafka
- **Database:** MongoDB

---

**Built with ❤️ using modern web technologies**
