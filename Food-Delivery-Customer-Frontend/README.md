# Customer Frontend Application

A modern React application for customers to browse restaurants, manage carts, and place orders.

## 🛠️ Tech Stack

### Core
*   **Framework:** React 19.1.1 (Vite 7 with Rolldown)
*   **Language:** TypeScript 5.9.3
*   **Routing:** React Router DOM 7.9.4

### State Management
*   **Client State:** Zustand 5.0.8 (Cart & Auth)
*   **Server State:** TanStack Query 5.90.5 (React Query)

### UI & Styling
*   **Styling:** Tailwind CSS 4.1.14
*   **Components:** Shadcn UI (Radix UI primitives)
*   **Icons:** Lucide React
*   **Notifications:** Sonner (Toast notifications)

### Integrations
*   **Payments:** Stripe (@stripe/stripe-js)
*   **HTTP Client:** Axios

## ✨ Features

*   **Restaurant Discovery:** Browse and search restaurants with filtering
*   **Menu Browsing:** View menu items organized by category
*   **Cart Management:** Add/remove items, persistent cart (localStorage for guests, database for authenticated users)
*   **Secure Checkout:** Delivery address selection and Stripe payment integration
*   **Order Tracking:** Real-time status updates for active orders
*   **Order History:** View past orders with details
*   **User Authentication:** JWT-based auth with automatic token refresh
*   **User Profile:** Manage delivery addresses and account settings

## 📋 Prerequisites

*   **Node.js:** 18.x or higher
*   **npm:** 9.x or higher
*   **Backend Services:** All backend services must be running (see backend README)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001
VITE_USER_API_URL=http://localhost:5005
VITE_ORDER_API_URL=http://localhost:5001
VITE_PAYMENT_API_URL=http://localhost:5002
VITE_RESTAURANT_API_URL=http://localhost:5006
VITE_DELIVERY_API_URL=http://localhost:5004
VITE_NOTIFICATION_API_URL=http://localhost:5003

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

**Environment Variable Details:**

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:5001` | Base URL for API gateway/order service |
| `VITE_USER_API_URL` | `http://localhost:5005` | User service endpoint |
| `VITE_ORDER_API_URL` | `http://localhost:5001` | Order service endpoint |
| `VITE_PAYMENT_API_URL` | `http://localhost:5002` | Payment service endpoint |
| `VITE_RESTAURANT_API_URL` | `http://localhost:5006` | Restaurant service endpoint |
| `VITE_DELIVERY_API_URL` | `http://localhost:5004` | Delivery service endpoint |
| `VITE_NOTIFICATION_API_URL` | `http://localhost:5003` | Notification service endpoint |
| `VITE_STRIPE_PUBLISHABLE_KEY` | (required) | Your Stripe publishable key |

**Note:** For production deployment via Kubernetes, these values are set via Docker build arguments.

### 3. Run Development Server

```bash
npm run dev
```

The application will start at **`http://localhost:5173`**

### 4. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication

This app supports both guest and authenticated users:

*   **Guest Users:** Can browse restaurants and add items to cart (stored in localStorage)
*   **Authenticated Users:** Full access including checkout, order tracking, and history

**Example Test Accounts (role: `customer`):**

| Name | Email | Password |
|------|-------|----------|
| John Doe | `john@example.com` | `Password123!` |
| Jane Smith | `jane@example.com` | `Password123!` |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── cart/           # Cart drawer and related
│   ├── layout/         # Header, Footer, Layout
│   └── ui/             # Shadcn UI components
├── pages/              # Route pages
│   ├── Home.tsx        # Restaurant listings
│   ├── RestaurantMenu.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── OrderTracking.tsx
│   ├── OrderHistory.tsx
│   ├── OrderSuccess.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── Profile.tsx
├── services/           # API service layer
│   ├── baseApi.ts      # Base API class with interceptors
│   ├── authApi.ts      # Authentication endpoints
│   ├── restaurantApi.ts
│   ├── orderApi.ts
│   ├── paymentApi.ts
│   ├── userApi.ts
│   └── tokenRefresh.ts
├── store/              # Zustand stores
│   ├── authStore.ts    # Authentication state
│   └── cartStore.ts    # Cart state with DB sync
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── config/             # Configuration files
```

## 🐳 Docker Deployment

Build the Docker image:

```bash
docker build -t customer-frontend \
  --build-arg VITE_API_BASE_URL=http://api.fooddelivery.local \
  --build-arg VITE_USER_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_ORDER_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_PAYMENT_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_RESTAURANT_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_DELIVERY_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_NOTIFICATION_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_STRIPE_PUBLISHABLE_KEY=your_key \
  .
```

Run the container:

```bash
docker run -p 5173:80 customer-frontend
```

Access at **http://localhost:5173**

## 🧪 Development Notes

*   **React Query DevTools:** Available in development mode
*   **Hot Module Replacement:** Enabled via Vite
*   **TypeScript:** Strict mode enabled
*   **Linting:** ESLint configured with React rules

## 📝 Available Scripts

*   `npm run dev` - Start development server (port 5173)
*   `npm run build` - Build for production
*   `npm run preview` - Preview production build
*   `npm run lint` - Run ESLint

## 🔧 Troubleshooting

**Cart not persisting:**
*   Guest users: Check browser localStorage
*   Logged-in users: Ensure user-service is running and DB connection is active

**Payment not working:**
*   Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
*   Ensure payment-service is running
*   Check Stripe dashboard for webhook configuration

**401 Unauthorized errors:**
*   Token may have expired - logout and login again
*   Ensure refresh token cookie is being sent (credentials: true)