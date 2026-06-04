import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import { getAllOrders } from "../../services/orderService";

function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [branch, setBranch] = useState("BROAST CHASERS");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.orders || []);
    } catch (error) {
      console.error("Dashboard orders load error", error);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = order.created_at
        ? new Date(order.created_at).toISOString().slice(0, 10)
        : "";

      const dateMatch =
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);

      const searchText = search.toLowerCase();

      const searchMatch =
        !search ||
        order.customer_name?.toLowerCase().includes(searchText) ||
        order.phone?.toLowerCase().includes(searchText) ||
        order.order_number?.toLowerCase().includes(searchText) ||
        order.tracking_number?.toLowerCase().includes(searchText);

      return dateMatch && searchMatch;
    });
  }, [orders, startDate, endDate, search]);

  const grossSales = filteredOrders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

  const netSales = filteredOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const totalOrders = filteredOrders.length;

  const totalCustomers = new Set(
    filteredOrders.map((order) => order.phone)
  ).size;

  const avgOrderValue =
    totalOrders > 0 ? Math.round(netSales / totalOrders) : 0;

  const paymentStats = useMemo(() => {
    const summary = {};

    filteredOrders.forEach((order) => {
      const mode = order.payment_mode || "Unknown";
      summary[mode] = (summary[mode] || 0) + Number(order.total_amount || 0);
    });

    return Object.entries(summary).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredOrders]);

  const orderStatusStats = useMemo(() => {
    const summary = {};

    filteredOrders.forEach((order) => {
      const status = order.status || "Unknown";
      summary[status] = (summary[status] || 0) + 1;
    });

    return Object.entries(summary).map(([status, quantity]) => ({
      status,
      quantity
    }));
  }, [filteredOrders]);

  const printReport = () => {
    window.print();
  };

  return (
    <div className="dashboard-v2">
      <div className="dashboard-toolbar">
        <div className="date-range-box">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <span>to</span>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="branch-box">
          <label>Select Branches</label>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option>BROAST CHASERS</option>
          </select>
        </div>

        <input
          className="dashboard-search"
          placeholder="Search User / Order / Phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="dashboard-print-btn" onClick={printReport}>
          🖨 Print
        </button>
      </div>

      <div className="dashboard-grid-main">
        <div className="dashboard-left">
          <div className="dashboard-sales-row">
            <div className="dashboard-stat-card">
              <div className="stat-icon">💵</div>
              <span>Gross Sale</span>
              <h2>{grossSales.toLocaleString()}.00</h2>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-icon">💰</div>
              <span>Net Sale</span>
              <h2>{netSales.toLocaleString()}.00</h2>
            </div>
          </div>

          <div className="dashboard-two-col">
            <div className="dashboard-panel">
              <h3>Customers</h3>

              <div className="panel-highlight">
                Total Customers: {totalCustomers}
              </div>

              <div className="report-line">
                <span>Returning Customers</span>
                <strong>0</strong>
              </div>

              <div className="report-line">
                <span>Avg. Spent Per Customer</span>
                <strong>{avgOrderValue}.00</strong>
              </div>
            </div>

            <div className="dashboard-panel">
              <h3>Sales Report</h3>

              <div className="panel-highlight">
                Gross Sale: {grossSales.toLocaleString()}.00
              </div>

              <div className="report-line">
                <span>Returns</span>
                <strong>0.00</strong>
              </div>

              <div className="report-line">
                <span>Avg. Net Sale</span>
                <strong>{avgOrderValue}.00</strong>
              </div>

              <div className="report-line">
                <span>Net Sale</span>
                <strong>{netSales.toLocaleString()}.00</strong>
              </div>

              <div className="report-line">
                <span>Delivery Charges</span>
                <strong>0.00</strong>
              </div>

              <div className="report-line">
                <span>Service Charges</span>
                <strong>0.00</strong>
              </div>

              <div className="report-line">
                <span>Sales Tax</span>
                <strong>0.00</strong>
              </div>

              <button className="panel-detail-btn">
                View Details
              </button>
            </div>
          </div>

          <div className="dashboard-two-col">
            <div className="dashboard-panel">
              <h3>Orders</h3>

              <div className="panel-highlight">
                Total Orders: {totalOrders} &nbsp;&nbsp; Total Revenue:{" "}
                {grossSales.toLocaleString()}.00
              </div>

              <table className="mini-report-table">
                <thead>
                  <tr>
                    <th>Order Status</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {orderStatusStats.map((item) => (
                    <tr key={item.status}>
                      <td>{item.status}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard-panel">
              <h3>Discounts</h3>

              <div className="panel-highlight">
                Total Discounts: 0
              </div>

              <table className="mini-report-table">
                <thead>
                  <tr>
                    <th>Discount</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>No Discount</td>
                    <td>{totalOrders}</td>
                    <td>0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-panel recent-orders-panel">
            <h3>Recent Orders</h3>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Customer</th>
                    <th>WhatsApp</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.slice(0, 10).map((order) => (
                    <tr key={order.id}>
                      <td>{order.order_number}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.phone}</td>
                      <td>{order.status}</td>
                      <td>{order.payment_mode}</td>
                      <td>Rs. {order.total_amount}</td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6">No orders found for selected date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="dashboard-panel chart-panel">
            <h3>Sales Statistics</h3>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={paymentStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {paymentStats.map((_, index) => (
                    <Cell
                      key={index}
                      fill={["#6F2DA8", "#7895CB", "#FFC107", "#25D366"][index % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-panel chart-panel">
            <h3>Order Status</h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={orderStatusStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#6F2DA8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-side-actions">
            <Link to="/admin/menu-settings">
              <button className="primary-btn">Menu Settings</button>
            </Link>

            <Link to="/admin/orders">
              <button className="secondary-btn">View Orders</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;