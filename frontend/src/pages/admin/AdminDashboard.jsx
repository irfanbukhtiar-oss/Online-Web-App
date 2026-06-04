import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getDashboardStats,
  getSalesReport
} from "../../services/orderService";

function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState(today);
  const [dashboard, setDashboard] = useState(null);
  const [report, setReport] = useState(null);

  const loadDashboard = async (date) => {
    try {
      const dashboardRes = await getDashboardStats(date);
      const reportRes = await getSalesReport(date);

      setDashboard(dashboardRes.dashboard);
      setReport(reportRes.report);
    } catch (error) {
      console.error("Dashboard load error", error);
    }
  };

  useEffect(() => {
    loadDashboard(selectedDate);
  }, [selectedDate]);

  return (
    <div className="admin-layout">
      <h1>Admin Dashboard</h1>

      <div className="admin-filter-bar">
        <div>
          <label>Date Wise Report</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <button
          className="secondary-btn"
          onClick={() => setSelectedDate(today)}
        >
          Today
        </button>

        <button
          className="secondary-btn"
          onClick={() => setSelectedDate("")}
        >
          All Orders
        </button>
      </div>

      <div className="admin-actions">
        <Link to="/admin/menu-settings">
          <button className="primary-btn">Menu Settings</button>
        </Link>

        <Link to={`/admin/orders${selectedDate ? `?date=${selectedDate}` : ""}`}>
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
            <h3>Pending</h3>
            <p className="price">{dashboard.pending_orders}</p>
          </div>

          <div className="card">
            <h3>Confirmed</h3>
            <p className="price">{dashboard.confirmed_orders}</p>
          </div>

          <div className="card">
            <h3>Delivered</h3>
            <p className="price">{dashboard.delivered_orders}</p>
          </div>

          <div className="card">
            <h3>Cancelled</h3>
            <p className="price">{dashboard.cancelled_orders}</p>
          </div>

          <div className="card">
            <h3>Net Sales</h3>
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

      {report && (
        <div className="sales-report-box">
          <h2>Sales Report</h2>

          <div className="grid">
            <div className="card">
              <h3>Gross Sales</h3>
              <p className="price">Rs. {report.gross_sales}</p>
            </div>

            <div className="card">
              <h3>Net Sales</h3>
              <p className="price">Rs. {report.net_sales}</p>
            </div>

            <div className="card">
              <h3>Total Orders</h3>
              <p className="price">{report.total_orders}</p>
            </div>
          </div>

          <h3>Payment Summary</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Payment Mode</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(report.payment_summary || {}).map(
                  ([mode, amount]) => (
                    <tr key={mode}>
                      <td>{mode}</td>
                      <td>Rs. {amount}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <h3>Status Summary</h3>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Orders</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(report.status_summary || {}).map(
                  ([status, count]) => (
                    <tr key={status}>
                      <td>{status}</td>
                      <td>{count}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;