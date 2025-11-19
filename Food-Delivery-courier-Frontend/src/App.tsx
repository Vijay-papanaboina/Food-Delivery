import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/queryClient";
import { useAuthInit } from "@/hooks/useAuthInit";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/pages/Login";
import { ActiveDeliveries } from "@/pages/ActiveDeliveries";
import { DeliveryDetail } from "@/pages/DeliveryDetail";
import { DeliveryHistory } from "@/pages/DeliveryHistory";
import { Stats } from "@/pages/Stats";
import { Profile } from "@/pages/Profile";

function AppContent() {
  useAuthInit();

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/deliveries" replace />} />
            <Route path="/deliveries" element={<ActiveDeliveries />} />
            <Route
              path="/deliveries/:deliveryId"
              element={<DeliveryDetail />}
            />
            <Route path="/history" element={<DeliveryHistory />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
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
