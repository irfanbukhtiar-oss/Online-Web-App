import { useState } from "react";
import { trackOrder } from "../services/trackingService";

function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!trackingNumber && !phone) {
      setError("Enter tracking number or WhatsApp number.");
      return;
    }

    try {
      const res = await trackOrder({
        tracking_number: trackingNumber,
        phone
      });

      if (res.success) {
        setOrder(res.order);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Order not found.");
    }
  };

  return (
    <div className="form-page">
      <h2>Order Tracking</h2>

      <form onSubmit={handleTrack}>
        <div className="form-group">
          <label>Tracking Number</label>
          <input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="TRK-482913"
          />
        </div>

        <div className="form-group">
          <label>WhatsApp Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="03001234567"
          />
        </div>

        <button className="primary-btn" type="submit">
          Track Order
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {order && (
        <div className="card" style={{ marginTop: "24px" }}>
          <h3>{order.order_number}</h3>
          <p><strong>Tracking:</strong> {order.tracking_number}</p>
          <p><strong>Name:</strong> {order.customer_name}</p>
          <p><strong>WhatsApp:</strong> {order.phone}</p>
          <p><strong>Order Type:</strong> {order.order_type}</p>
          <p><strong>Payment:</strong> {order.payment_mode}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> Rs. {order.total_amount}</p>

          {order.address && (
            <p><strong>Address:</strong> {order.address}</p>
          )}

          {order.google_location && (
            <p>
              <strong>Google Location:</strong>{" "}
              <a
                href={order.google_location}
                target="_blank"
                rel="noreferrer"
              >
                Open Location
              </a>
            </p>
          )}

          <h4>Items</h4>
          {order.items.map((item) => (
            <p key={item.id}>
              {item.name} x {item.quantity} = Rs. {item.subtotal}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrackOrder;