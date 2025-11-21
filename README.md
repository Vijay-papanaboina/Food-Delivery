# 🍔 Food Delivery Microservices Platform

A comprehensive, full-stack food delivery platform built with a modern microservices architecture. This monorepo contains the backend services and three distinct frontend applications for Customers, Restaurants, and Couriers.

## 🌟 Project Overview

This system demonstrates a production-ready event-driven architecture using:
*   **Backend:** Node.js (Express), MongoDB (Mongoose), Apache Kafka (Event Bus).
*   **Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn UI.
*   **Infrastructure:** Docker, Docker Compose, Kubernetes (K8s).

### 🏗️ Architecture

The backend is composed of 6 isolated microservices following the **Service Layer pattern**:

| Service | Port | Description | Database |
| :--- | :--- | :--- | :--- |
| **User Service** | 3000 | Authentication (JWT), User Profiles, Cart management. | MongoDB |
| **Order Service** | 3000 | Order creation, validation, lifecycle tracking. | MongoDB |
| **Restaurant Service**| 3000 | Menu management, Restaurant status, Kitchen orders. | MongoDB |
| **Delivery Service** | 3000 | Driver management, Auto-assignment logic, Delivery tracking. | MongoDB |
| **Payment Service** | 3000 | Payment processing (Stripe integration), Webhooks. | MongoDB |
| **Notification Service**| 3000 | Event-driven notifications (simulated/log-based). | N/A |

**Note:** All services run on internal port 3000 but are mapped to different external ports (5001-5006) via Docker/Gateway or locally configured.

### 🖥️ Frontend Applications

| Application | Port | Description |
| :--- | :--- | :--- |
| **Customer App** | 5173 | Browse restaurants, manage cart, place orders, track delivery. |
| **Restaurant App** | 5174 | Manage menu, toggle status, view/accept kitchen orders. |
| **Courier App** | 5175 | View assigned deliveries, update status (pickup/complete). |

---

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18+ recommended)
*   **npm** or **yarn**
*   **Docker** & **Docker Compose** (for running Kafka and MongoDB)

### 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd food-delivery-platform
    ```

2.  **Install Backend Dependencies:**
    ```bash
    # Install root dependencies (if any) or go to backend folder
    cd Food-Delivery-Backend
    
    # Install dependencies for each microservice
    cd user-service && npm install && cd ..
    cd order-service && npm install && cd ..
    cd restaurant-service && npm install && cd ..
    cd delivery-service && npm install && cd ..
    cd payment-service && npm install && cd ..
    cd notification-service && npm install && cd ..
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    # Go back to root
    cd ../..

    # Customer Frontend
    cd Food-Delivery-Customer-Frontend && npm install

    # Restaurant Frontend
    cd ../Food-Delivery-Restaurant-Frontend && npm install

    # Courier Frontend
    cd ../Food-Delivery-Courier-Frontend && npm install
    ```

### 🚦 Running the System

#### 1. Start Infrastructure (Kafka & MongoDB)
The system relies on Kafka for event streaming and MongoDB for data persistence.

```bash
cd Food-Delivery-Backend
docker-compose up -d
```
*This will start Zookeeper, Kafka, and MongoDB containers.*

#### 2. Seed the Database (Optional but Recommended)
Populate the database with sample users, restaurants, menus, and drivers.

```bash
cd Food-Delivery-Backend
npm run seed
```

#### 3. Start Backend Services
You can run each service in a separate terminal or use a process manager.

```bash
# Terminal 1: User Service
cd Food-Delivery-Backend/user-service && npm run dev

# Terminal 2: Order Service
cd Food-Delivery-Backend/order-service && npm run dev

# Terminal 3: Restaurant Service
cd Food-Delivery-Backend/restaurant-service && npm run dev

# Terminal 4: Delivery Service
cd Food-Delivery-Backend/delivery-service && npm run dev

# Terminal 5: Payment Service
cd Food-Delivery-Backend/payment-service && npm run dev

# Terminal 6: Notification Service
cd Food-Delivery-Backend/notification-service && npm run dev
```

#### 4. Start Frontend Applications

```bash
# Terminal 7: Customer App
cd Food-Delivery-Customer-Frontend && npm run dev
# Access at http://localhost:5173

# Terminal 8: Restaurant App
cd Food-Delivery-Restaurant-Frontend && npm run dev
# Access at http://localhost:5174

# Terminal 9: Courier App
cd Food-Delivery-Courier-Frontend && npm run dev
# Access at http://localhost:5175
```

---

## 📚 Documentation

For detailed information about specific components, please refer to their respective READMEs:

*   [Backend Services Documentation](./Food-Delivery-Backend/README.md) - API endpoints, Kafka topics, and data models.
*   [Customer Frontend Documentation](./Food-Delivery-Customer-Frontend/README.md)
*   [Restaurant Frontend Documentation](./Food-Delivery-Restaurant-Frontend/README.md)
*   [Courier Frontend Documentation](./Food-Delivery-Courier-Frontend/README.md)
*   [Kubernetes Deployment](./k8s/README.md) - Guide for deploying to K8s cluster.

## 🔑 Key Features & Implementation Details

*   **Standardized API:** All services use `id` (camelCase) as the primary key identifier in API responses, abstracting away database specifics (`_id`).
*   **Service Layer Pattern:** All business logic is encapsulated in `services/` directories, keeping controllers thin and testable.
*   **Event-Driven:** Critical flows like Order Creation, Payment Processing, and Delivery Assignment are decoupled using Kafka events.
*   **Data Consistency:** Frontend applications are strictly typed (TypeScript) and aligned with backend response structures.

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
