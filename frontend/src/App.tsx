import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/Home";
import { WaresPage } from "@/pages/Wares";
import { AboutPage } from "@/pages/About";
import { CartPageView } from "@/pages/Cart";
import { CheckoutPage } from "@/pages/Checkout";
import { OrderConfirmationPage } from "@/pages/OrderConfirmation";
import { LoginPage } from "@/pages/Login";
import { AdminDashboardPage } from "@/pages/AdminDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/wares" element={<WaresPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPageView />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
