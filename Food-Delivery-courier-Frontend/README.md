# Courier Frontend Application

A mobile-first application for delivery drivers to manage and fulfill orders.

## 🛠️ Tech Stack
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **State Management:** Zustand (Auth) + TanStack Query.
*   **Styling:** Tailwind CSS + Shadcn UI (Mobile optimized).
*   **Routing:** React Router DOM

## ✨ Features
*   **Availability Toggle:** Go online/offline to receive orders.
*   **Active Deliveries:** View assigned, picked up, and completed deliveries.
*   **Order Management:**
    *   **Accept/Decline:** Respond to new delivery assignments.
    *   **Pickup:** Mark order as picked up from the restaurant.
    *   **Complete:** Mark order as delivered to the customer.
*   **Delivery History:** View past deliveries and earnings.

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5175`.

## 🔐 Authorization
This app requires a user with the `driver` role.
*   **Default Login:** `john.smith@driver.com` / `password`