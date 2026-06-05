import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../../services/orderService";

import {
  createOrderConfirmationMessage,
  createStatusUpdateMessage,
  openWhatsAppMessage
} from "../../services/whatsappUtils";

function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialDate = searchParams.get("date") || "";

  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [newOrderAlert, setNewOrderAlert] = useState("");
  const [loading, setLoading] = useState(true);

  const previousOrderCount = useRef(0);
  const firstLoad = useRef(true);

  const statuses = [
    "Pending",
    "Confirmed",
    "Sent to Kitchen",
    "Food Ready",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const playBeep = () => {
    try {
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 900;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      console.error("Beep sound failed", error);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await getAllOrders(selectedDate);
      const latestOrders = res.orders || [];

      setOrders(latestOrders);

      if (
        !firstLoad.current &&
        latestOrders.length > previousOrderCount.current
      ) {
        playBeep();
        setNewOrderAlert("New order received!");
        document.title = "New Order - Broast Chasers";

        setTimeout(() => {
          setNewOrderAlert("");
          document.title = "Broast Chasers";
        }, 6000);
      }

      previousOrderCount.current = latestOrders.length;
      firstLoad.current = false;
    } catch (error) {
      console.error("Orders loading error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleDateChange = (value) => {
    setSelectedDate(value);

    if (value) {
      setSearchParams({ date: value });
    } else {
      setSearchParams({});
    }

    firstLoad.current = true;
    previousOrderCount.current = 0;
  };

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    await deleteOrder(orderId);
    loadOrders();
  };

  const sendConfirmation = (order) => {
    const message = createOrderConfirmationMessage(order);
    openWhatsAppMessage(order.phone, message);
  };

  const sendStatusUpdate = (order) => {
    const message = createStatusUpdateMessage(order);
    openWhatsAppMessage(order.phone, message);
  };

  const sendTrackingMessage = (order) => {
    const message = encodeURIComponent(
      `Assalam o Alaikum ${order.customer_name},

Your Broast Chasers order tracking details:

Order Number: ${order.order_number}
Tracking Number: ${order.tracking_number}
Current Status: ${order.status}

You can track your order using your tracking number or WhatsApp number.

Thank you.`
    );

    openWhatsAppMessage(order.phone, message);
  };

  const calculateTotalSales = () => {
    return orders
      .filter((order) => order.status !== "Cancelled")
      .reduce((total, order) => total + Number(order.total_amount || 0), 0);
  };

  return (
    <div className="admin-layout">
      <h1>Admin Orders</h1>

      {newOrderAlert && (
        <div className="new-order-alert">
          🔔 {newOrderAlert}
        </div>
      )}

      <p className="admin-note">
        Orders auto-refresh every 10 seconds. New orders trigger beep alert.
        Manager can communicate with customers using WhatsApp buttons.
      </p>

      <div className="admin-filter-bar">
        <div>
          <label>Filter Orders By Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>

        <button
          className="secondary-btn"
          onClick={() => handleDateChange("")}
        >
          All Orders
        </button>

        <button
          className="secondary-btn"
          onClick={() => loadOrders()}
        >
          Refresh
        </button>
      </div>

      <div className="grid" style={{ marginBottom: "24px" }}>
        <div className="card">
          <h3>Total Orders</h3>
          <p className="price">{orders.length}</p>
        </div>

        <div className="card">
          <h3>Total Sales</h3>
          <p className="price">Rs. {calculateTotalSales()}</p>
        </div>

        <div className="card">
          <h3>Pending Orders</h3>
          <p className="price">
            {orders.filter((order) => order.status === "Pending").length}
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Date</th>
                <th>Tracking</th>
                <th>Name</th>
                <th>WhatsApp</th>
                <th>Type</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Address / Location</th>
                <th>Communication</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="13">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className={
                      order.status === "Pending" ? "pending-order-row" : ""
                    }
                  >
                    <td>{order.order_number}</td>

                    <td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString("en-PK")
                        : "-"}
                    </td>

                    <td>{order.tracking_number}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.phone}</td>
                    <td>{order.order_type}</td>
                    <td>{order.payment_mode}</td>
                    <td>Rs. {order.total_amount}</td>

                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>

                    <td>
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td>
                      {order.address && <div>{order.address}</div>}

                      {order.google_location && (
                        <a
                          href={order.google_location}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Location
                        </a>
                      )}
                    </td>

                    <td>
                      <button
                        className="whatsapp-btn"
                        onClick={() => sendConfirmation(order)}
                      >
                        Send Confirmation
                      </button>

                      <button
                        className="whatsapp-secondary-btn"
                        onClick={() => sendStatusUpdate(order)}
                      >
                        Send Status
                      </button>

                      <button
                        className="whatsapp-secondary-btn"
                        onClick={() => sendTrackingMessage(order)}
                      >
                        Send Tracking
                      </button>
                    </td>

                    <td>
                      <button onClick={() => handleDelete(order.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;