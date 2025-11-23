# Restaurant Frontend Application

A management dashboard for restaurant owners to manage their menus and kitchen operations.

## 🛠️ Tech Stack

### Core
*   **Framework:** React 19.1.1 (Vite 7 with Rolldown)
*   **Language:** TypeScript 5.9.3
*   **Routing:** React Router DOM 7.9.4

### State Management
*   **Client State:** Zustand 5.0.8 (Auth & UI)
*   **Server State:** TanStack Query 5.90.5 (React Query)

### UI & Styling
*   **Styling:** Tailwind CSS 4.1.14
*   **Components:** Shadcn UI (Radix UI primitives)
*   **Icons:** Lucide React
*   **Notifications:** Sonner (Toast notifications)

### HTTP Client
*   **Axios:** For API requests with interceptors

## ✨ Features

*   **Dashboard:** Overview of daily stats (revenue, orders, analytics)
*   **Menu Management:** Create, Read, Update, Delete (CRUD) menu items with images
*   **Availability Control:** Toggle individual item availability and restaurant open/closed status
*   **Kitchen Orders:** Real-time view of incoming orders organized by status
*   **Order Processing:** Accept orders and mark them as "Ready" to trigger delivery assignment
*   **User Authentication:** JWT-based auth with automatic token refresh
*   **Restaurant Status:** Toggle restaurant availability to accept/pause new orders

## 📋 Prerequisites

*   **Node.js:** 18.x or higher
*   **npm:** 9.x or higher
*   **Backend Services:** User service and Restaurant service must be running
*   **Restaurant Account:** User account with `restaurant` role

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_USER_API_URL=http://localhost:3001
VITE_RESTAURANT_API_URL=http://localhost:3003
```

**Environment Variable Details:**

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_USER_API_URL` | `http://localhost:3001` | User service endpoint for authentication |
| `VITE_RESTAURANT_API_URL` | `http://localhost:3003` | Restaurant service endpoint for menu and orders |

**Note:** For production deployment via Kubernetes, these values are set via Docker build arguments.

### 3. Run Development Server

```bash
npm run dev
```

The application will start at **`http://localhost:5174`**

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

This app requires a user account with the **`restaurant`** role.

**Example Test Accounts (role: `restaurant`):**

| Restaurant Name | Email | Password | Owner Name |
|-----------------|-------|----------|------------|
| Mario's Pizza Palace | `mario@pizzapalace.com` | `Password123!` | Mario Rossi |
| Burger Junction | `burger@junction.com` | `Password123!` | Burger Master |
| Thai Garden | `thai@garden.com` | `Password123!` | Thai Chef |

**Note:** Each restaurant user can only manage their own restaurant's menu and orders.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Header, Sidebar
│   ├── ui/             # Shadcn UI components
│   ├── MenuItemModal.tsx   # Menu item creation/editing
│   └── ProtectedRoute.tsx  # Route protection
├── pages/              # Route pages
│   ├── Dashboard.tsx   # Stats and analytics
│   ├── Orders.tsx      # Kitchen orders view
│   ├── Menu.tsx        # Menu management
│   ├── Status.tsx      # Restaurant status control
│   └── Login.tsx       # Authentication
├── services/           # API service layer
│   ├── baseApi.ts      # Base API class with interceptors
│   ├── authApi.ts      # Authentication endpoints
│   ├── restaurantApi.ts # Menu and orders
│   ├── ordersApi.ts    # Kitchen order operations
│   └── tokenRefresh.ts # Token refresh logic
├── store/              # Zustand stores
│   ├── authStore.ts    # Authentication state
│   └── uiStore.ts      # UI state (sidebar, modals)
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── config/             # Configuration files
```

## 🎯 Key Workflows

### Adding a Menu Item
1. Navigate to **Menu** page
2. Click **"Add Item"** button
3. Fill in item details (name, description, price, category, image)
4. Toggle **"Available"** to set initial availability
5. Click **"Create"**

### Managing Kitchen Orders
1. Navigate to **Orders** page
2. View orders organized by status tabs:
   - **Pending:** New orders awaiting acceptance
   - **Confirmed:** Accepted orders being prepared
   - **Ready:** Completed orders awaiting pickup
3. Accept pending orders by clicking **"Accept"**
4. Mark confirmed orders as ready by clicking **"Mark Ready"**
5. Once marked ready, delivery service will auto-assign a driver

### Managing Restaurant Availability
1. Navigate to **Status** page
2. Toggle **"Restaurant Open"** switch
3. When closed, customers cannot place new orders
4. Existing orders can still be processed

## 🐳 Docker Deployment

Build the Docker image:

```bash
docker build -t restaurant-frontend \
  --build-arg VITE_USER_API_URL=http://api.fooddelivery.local \
  --build-arg VITE_RESTAURANT_API_URL=http://api.fooddelivery.local \
  .
```

Run the container:

```bash
docker run -p 5174:80 restaurant-frontend
```

Access at **http://localhost:5174**

## 🧪 Development Notes

*   **React Query DevTools:** Available in development mode
*   **Hot Module Replacement:** Enabled via Vite
*   **TypeScript:** Strict mode enabled
*   **Linting:** ESLint configured with React rules
*   **Auto-refresh:** Orders page auto-refreshes every 30 seconds

## 📝 Available Scripts

*   `npm run dev` - Start development server (port 5174)
*   `npm run build` - Build for production
*   `npm run preview` - Preview production build
*   `npm run lint` - Run ESLint

## 🔧 Troubleshooting

**Cannot see orders:**
*   Ensure restaurant-service is running
*   Check that your user account has `restaurantId` set
*   Verify orders exist in the database for your restaurant

**Menu items not updating:**
*   Hard refresh the page (Ctrl+Shift+R)
*   Check browser console for API errors
*   Verify restaurant-service is accessible

**401 Unauthorized errors:**
*   Token may have expired - logout and login again
*   Ensure refresh token cookie is being sent
*   Check that user has `restaurant` role

**Images not uploading:**
*   Currently images are stored as URLs (not file uploads)
*   Enter image URL in the image field
*   Ensure URL is publicly accessible