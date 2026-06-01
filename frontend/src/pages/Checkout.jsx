import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    order_type: "Delivery",
    payment_mode: "COD",
    qr_transaction_id: "",
    special_note: ""
  });

  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Cart is empty.");
      return;
    }

    if (form.payment_mode === "QR Payment" && !form.qr_transaction_id) {
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
          <label>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
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
          </select>
        </div>

        <div className="form-group">
          <label>Payment Mode</label>
          <select
            value={form.payment_mode}
            onChange={(e) => updateField("payment_mode", e.target.value)}
          >
            <option>COD</option>
            <option>QR Payment</option>
          </select>
        </div>

        {form.payment_mode === "QR Payment" && (
          <div className="form-group">
            <label>QR Transaction ID</label>
            <input
              value={form.qr_transaction_id}
              onChange={(e) => updateField("qr_transaction_id", e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Special Note</label>
          <textarea
            value={form.special_note}
            onChange={(e) => updateField("special_note", e.target.value)}
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