import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";
import qrPayment from "../assets/qr-payment.jpeg";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    google_location: "",
    order_type: "Delivery",
    payment_mode: "COD",
    qr_transaction_id: "",
    special_note: ""
  });

  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Google current location is not supported in this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const googleMapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        updateField("google_location", googleMapLink);
        setLocationLoading(false);
      },
      () => {
        setError("Unable to get current location. Please allow location permission.");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Cart is empty.");
      return;
    }

    if (form.order_type === "Delivery") {
      if (!form.address && !form.google_location) {
        setError("Address or Google current location is required for delivery.");
        return;
      }
    }

    if (form.payment_mode === "QR Scan" && !form.qr_transaction_id) {
      setError("QR Transaction ID is required.");
      return;
    }

    try {
      const payload = {
        ...form,
        items: cartItems
      };

      const res = await placeOrder(payload);

      if (res.success) {
        clearCart();

        navigate(`/order-success/${res.order.tracking_number}`, {
          state: { order: res.order }
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Order failed.");
    }
  };

  return (
    <div className="form-page">
      <h2>Checkout / Order Now</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            value={form.customer_name}
            onChange={(e) => updateField("customer_name", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>WhatsApp Number</label>
          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="03001234567"
            required
          />
        </div>

        <div className="form-group">
          <label>Order Type</label>
          <select
            value={form.order_type}
            onChange={(e) => updateField("order_type", e.target.value)}
          >
            <option>Delivery</option>
            <option>Takeaway</option>
            <option>Dine-in</option>
          </select>
        </div>

        {form.order_type === "Delivery" && (
          <>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="House / Street / Area"
              />
            </div>

            <div className="form-group">
              <label>Google Current Location</label>

              <button
                type="button"
                className="secondary-btn"
                onClick={getCurrentLocation}
              >
                {locationLoading ? "Getting Location..." : "Use Current Location"}
              </button>

              {form.google_location && (
                <p>
                  <a
                    href={form.google_location}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open selected location
                  </a>
                </p>
              )}
            </div>
          </>
        )}

        <div className="form-group">
          <label>Payment Mode</label>
          <select
            value={form.payment_mode}
            onChange={(e) => updateField("payment_mode", e.target.value)}
          >
            <option>COD</option>
            <option>Card Payment</option>
            <option>QR Scan</option>
          </select>
        </div>

        {form.payment_mode === "QR Scan" && (
          <div className="form-group">
            <label>Scan QR for Online Payment</label>

            <div className="qr-box">
              <img src={qrPayment} alt="QR Payment" className="qr-image" />
            </div>

            <label>QR Transaction ID</label>
            <input
              value={form.qr_transaction_id}
              onChange={(e) => updateField("qr_transaction_id", e.target.value)}
              placeholder="Enter transaction/reference ID"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Special Note</label>
          <textarea
            value={form.special_note}
            onChange={(e) => updateField("special_note", e.target.value)}
            placeholder="Extra spicy, no mayo, etc."
          />
        </div>

        <h3>Total: Rs. {getTotal()}</h3>

        <button className="primary-btn" type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;