# Customer Frontend Application

A modern React application for customers to browse restaurants, manage carts, and place orders.

## 🛠️ Tech Stack
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **State Management:** Zustand (Cart & Auth)
*   **Data Fetching:** TanStack Query (React Query)
*   **Styling:** Tailwind CSS + Shadcn UI
*   **Routing:** React Router DOM

## ✨ Features
*   **Restaurant Discovery:** Browse and search restaurants with filtering.
*   **Menu Browsing:** View menu items organized by category.
*   **Cart Management:** Add/remove items, persistent cart (local storage + DB sync).
*   **Secure Checkout:** Delivery address selection and Stripe payment integration.
*   **Order Tracking:** Real-time status updates for active orders.
*   **Order History:** View past orders.

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5173`.

## 🔌 API Integration
This frontend communicates with the backend services via a unified API Gateway approach (or direct service calls in dev). It expects all backend entities to use `id` as the primary key.

**Key Environment Variables:**
*   `VITE_API_URL`: Base URL for the backend API.