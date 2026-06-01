import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../../services/orderService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const statuses = [
    "Pending Confirmation",
    "Confirmed",
    "Sent to Kitchen",
    "Food Ready",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const loadOrders = async () => {
    const res = await getAllOrders();
    setOrders(res.orders || []);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const handleDelete = async (orderId) => {
    await deleteOrder(orderId);
    loadOrders();
  };

  return (
    <div className="admin-layout">
      <h1>Admin Orders</h1>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Tracking</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
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