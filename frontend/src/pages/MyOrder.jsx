import { useState } from "react";
import { getMyOrders } from "../services/orderService";

function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setOrders([]);

    try {
      const res = await getMyOrders(phone);

      if (res.success) {
        setOrders(res.orders);
      }
    } catch (error) {
      setError(error.response?.data?.message || "No orders found.");
    }
  };

  return (
    <div className="form-page">
      <h2>My Orders</h2>

      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <button className="primary-btn">Find My Orders</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {orders.map((order) => (
        <div className="card" key={order.id} style={{ marginTop: "18px" }}>
          <h3>{order.order_number}</h3>
          <p><strong>Tracking:</strong> {order.tracking_number}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> Rs. {order.total_amount}</p>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;