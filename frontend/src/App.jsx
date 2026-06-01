import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import MenuDeals from "./pages/MenuDeals";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrder";

import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuSettings from "./pages/admin/MenuSettings";
import AdminOrders from "./pages/admin/AdminOrders";

function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/menu-deals" element={<MenuDeals />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/order-success/:trackingNumber"
            element={<OrderSuccess />}
          />

          <Route
            path="/track-order"
            element={<TrackOrder />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/menu-settings"
            element={
              <ProtectedRoute adminOnly={true}>
                <MenuSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;