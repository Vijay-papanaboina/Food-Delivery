import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/queryClient";
import { useAuthInit } from "@/hooks/useAuthInit";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Orders } from "@/pages/Orders";
import { Menu } from "@/pages/Menu";
import { Status } from "@/pages/Status";

function AppContent() {
  useAuthInit();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                    <Header />
                    <main className="flex-1 overflow-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/status" element={<Status />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
