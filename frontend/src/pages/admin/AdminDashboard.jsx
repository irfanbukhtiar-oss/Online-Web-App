import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.error("Dashboard load error", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="admin-layout">
      <h1>Admin Dashboard</h1>

      <div className="admin-actions">
        <Link to="/admin/menu-settings">
          <button className="primary-btn">Menu Settings</button>
        </Link>

        <Link to="/admin/orders">
          <button className="secondary-btn">View Orders</button>
        </Link>
      </div>

      {dashboard && (
        <div className="grid">
          <div className="card">
            <h3>Total Orders</h3>
            <p className="price">{dashboard.total_orders}</p>
          </div>

          <div className="card">
            <h3>Pending Orders</h3>
            <p className="price">{dashboard.pending_orders}</p>
          </div>

          <div className="card">
            <h3>Delivered Orders</h3>
            <p className="price">{dashboard.delivered_orders}</p>
          </div>

          <div className="card">
            <h3>Total Sales</h3>
            <p className="price">Rs. {dashboard.total_sales}</p>
          </div>

          <div className="card">
            <h3>Active Menu Items</h3>
            <p className="price">{dashboard.active_menu_items}</p>
          </div>

          <div className="card">
            <h3>Active Deals</h3>
            <p className="price">{dashboard.active_deals}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;