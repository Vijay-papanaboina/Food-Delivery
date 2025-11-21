# Restaurant Frontend Application

A management dashboard for restaurant owners to manage their menus and kitchen operations.

## 🛠️ Tech Stack
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **State Management:** TanStack Query (React Query) for server state.
*   **Styling:** Tailwind CSS + Shadcn UI
*   **Routing:** React Router DOM

## ✨ Features
*   **Dashboard:** Overview of daily stats (revenue, orders).
*   **Menu Management:** Create, Read, Update, Delete (CRUD) menu items.
*   **Availability Control:** Toggle item availability and restaurant open/closed status.
*   **Kitchen Orders:** Real-time view of incoming orders.
*   **Order Processing:** Mark orders as "Ready" to trigger delivery assignment.

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5174`.

## 🔐 Authorization
This app requires a user with the `restaurant` role.
*   **Default Login:** `mario@pizzapalace.com` / `password`