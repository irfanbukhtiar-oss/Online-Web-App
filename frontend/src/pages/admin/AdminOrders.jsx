import { useEffect, useRef, useState } from "react";
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
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState("");

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
  };

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      const latestOrders = res.orders || [];

      setOrders(latestOrders);

      if (!firstLoad.current && latestOrders.length > previousOrderCount.current) {
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
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const handleDelete = async (orderId) => {
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
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Tracking</th>
              <th>Name</th>
              <th>WhatsApp</th>
              <th>Type</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Address / Location</th>
              <th>WhatsApp Message</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={order.status === "Pending" ? "pending-order-row" : ""}
              >
                <td>{order.order_number}</td>
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
                </td>

                <td>
                  <button onClick={() => handleDelete(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;