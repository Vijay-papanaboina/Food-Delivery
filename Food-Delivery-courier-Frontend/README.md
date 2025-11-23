# Courier Frontend Application

A mobile-first application for delivery drivers to manage and fulfill orders.

## 🛠️ Tech Stack

### Core
*   **Framework:** React 19.1.1 (Vite 7 with Rolldown)
*   **Language:** TypeScript 5.9.3
*   **Routing:** React Router DOM 7.9.4

### State Management
*   **Client State:** Zustand 5.0.8 (Auth)
*   **Server State:** TanStack Query 5.90.5 (React Query)

### UI & Styling
*   **Styling:** Tailwind CSS 4.1.14 (Mobile-optimized)
*   **Components:** Shadcn UI (Radix UI primitives)
*   **Icons:** Lucide React
*   **Notifications:** Sonner (Toast notifications)

### HTTP Client
*   **Axios:** For API requests with interceptors

## ✨ Features

*   **Availability Toggle:** Go online/offline to receive delivery assignments
*   **Active Deliveries:** View all assigned deliveries organized by status
*   **Order Management:**
    *   **Accept/Decline:** Respond to new delivery assignments
    *   **Pick Up:** Mark order as picked up from the restaurant
    *   **Complete Delivery:** Mark order as delivered to the customer
*   **Delivery Detail View:** See customer address, restaurant location, and order details
*   **Delivery History:** View past deliveries with earnings breakdown
*   **Stats Dashboard:** Track daily/weekly earnings and delivery count
*   **User Authentication:** JWT-based auth with automatic token refresh

## 📋 Prerequisites

*   **Node.js:** 18.x or higher
*   **npm:** 9.x or higher
*   **Backend Services:** User, Restaurant, Order, and Delivery services must be running
*   **Driver Account:** User account with `driver` role

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_USER_API_URL=http://localhost:5005
VITE_RESTAURANT_API_URL=http://localhost:5006
VITE_ORDER_API_URL=http://localhost:5001
VITE_DELIVERY_API_URL=http://localhost:5004
```

**Environment Variable Details:**

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_USER_API_URL` | `http://localhost:5005` | User service endpoint for authentication |
| `VITE_RESTAURANT_API_URL` | `http://localhost:5006` | Restaurant service endpoint for restaurant details |
| `VITE_ORDER_API_URL` | `http://localhost:5001` | Order service endpoint for order information |
| `VITE_DELIVERY_API_URL` | `http://localhost:5004` | Delivery service endpoint for delivery operations |

**Note:** For production deployment via Kubernetes, these values are set via Docker build arguments.

### 3. Run Development Server

```bash
npm run dev
```

The application will start at **`http://localhost:5175`**

### 4. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## 🔐 Authorization

This app requires a user account with the **`driver`** role.

**Example Test Accounts (role: `driver`):**

| Name | Email | Password |
|------|-------|----------|
| Sarah Johnson | `sarah.johnson@driver.com` | `Password123!` |
| John Smith | `john.smith@driver.com` | `Password123!` |
| Mike Davis | `mike.davis@driver.com` | `Password123!` |

**Note:** Only users with `driver` role can access this application.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Header, Sidebar, Layout
│   ├── ui/             # Shadcn UI components
│   ├── AvailabilityToggle.tsx  # Driver availability control
│   └── ProtectedRoute.tsx      # Route protection
├── pages/              # Route pages
│   ├── ActiveDeliveries.tsx    # Main deliveries dashboard
│   ├── DeliveryDetail.tsx      # Individual delivery view
│   ├── DeliveryHistory.tsx     # Past deliveries
│   ├── Stats.tsx               # Earnings and statistics
│   ├── Profile.tsx             # Driver profile
│   └── Login.tsx               # Authentication
├── services/           # API service layer
│   ├── baseApi.ts      # Base API class with interceptors
│   ├── authApi.ts      # Authentication endpoints
│   ├── deliveryApi.ts  # Delivery operations
│   └── tokenRefresh.ts # Token refresh logic
├── store/              # Zustand stores
│   ├── authStore.ts    # Authentication state
│   └── deliveryStore.ts # Delivery-specific state (if any)
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── config/             # Configuration files
```

## 🎯 Key Workflows

### Going Online
1. Open the app and login with driver credentials
2. Toggle **"Available"** switch in the header or on Active Deliveries page
3. System will start assigning deliveries when orders are ready

### Accepting a Delivery
1. When a delivery is assigned, it appears in **"Assigned"** status
2. Review the delivery details (restaurant, customer address, earnings)
3. Click **"Accept"** to confirm the delivery
4. To decline, click **"Decline"** (with optional reason)

### Picking Up an Order
1. Navigate to the restaurant location
2. Find the delivery in **"Accepted"** or **"En Route to Restaurant"** tab
3. Click on the delivery card to view details
4. Click **"Picked Up"** button once you have the order

### Completing a Delivery
1. Navigate to the customer address
2. Find the delivery in **"En Route to Customer"** tab
3. Click on the delivery card
4. Click **"Delivered"** button to complete
5. Earnings will be updated automatically

### Viewing History & Stats
1. Navigate to **"History"** to see all past deliveries
2. Navigate to **"Stats"** to view:
   - Total deliveries completed
   - Total earnings (daily/weekly/monthly)
   - Average earnings per delivery
   - Performance metrics

## 📱 Mobile-First Design

This application is optimized for mobile devices:
*   **Responsive layouts** that work on phones, tablets, and desktops
*   **Touch-friendly buttons** and interactions
*   **Swipe gestures** for navigation (where applicable)
*   **Bottom navigation** for easy thumb access
*   **Large tap targets** for on-the-go use

**Recommended Usage:** On a mobile device or in browser mobile emulation mode.

## 🐳 Docker Deployment

Build the Docker image:

```bash
docker build -t courier-frontend \
  --build-arg VITE_USER_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_RESTAURANT_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_ORDER_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_DELIVERY_API_URL=http://api.fooddelivery.local \
  .
```

Run the container:

```bash
docker run -p 5175:80 courier-frontend
```

Access at **http://localhost:5175**

## 🧪 Development Notes

*   **React Query DevTools:** Available in development mode
*   **Hot Module Replacement:** Enabled via Vite
*   **TypeScript:** Strict mode enabled
*   **Linting:** ESLint configured with React rules
*   **Auto-refresh:** Active deliveries refresh automatically

## 📝 Available Scripts

*   `npm run dev` - Start development server (port 5175)
*   `npm run build` - Build for production
*   `npm run preview` - Preview production build
*   `npm run lint` - Run ESLint

## 🔧 Troubleshooting

**No deliveries appearing:**
*   Ensure you've toggled **"Available"** to online
*   Check that delivery-service is running
*   Verify there are orders in "Ready" status at restaurants
*   Check browser console for API errors

**Cannot accept deliveries:**
*   Ensure order-service and delivery-service are running
*   Check that the delivery is still in "Assigned" status
*   Verify your driver account is active

**401 Unauthorized errors:**
*   Token may have expired - logout and login again
*   Ensure refresh token cookie is being sent
*   Check that user has `driver` role

**Availability toggle not working:**
*   Check delivery-service connection
*   Ensure driverId is set in user profile
*   Hard refresh the page

## 🚦 Delivery Status Flow

```
1. ASSIGNED → Driver receives new delivery assignment
2. ACCEPTED → Driver accepts the delivery
3. PICKED_UP → Driver picks up order from restaurant
4. DELIVERED → Driver delivers order to customer
5. COMPLETED → Delivery is marked complete (with earnings)
```

**Note:** Declining a delivery returns it to the pool for reassignment.