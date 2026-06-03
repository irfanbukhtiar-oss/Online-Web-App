import { Link, useLocation, useParams } from "react-router-dom";

function OrderSuccess() {
  const { trackingNumber } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  return (
    <div className="success-box">
      <h2>Order placed successfully</h2>

      <div className="success-options">
        <div className="success-option-card">
          <h3>Tracking Number</h3>
          <p>{order?.tracking_number || trackingNumber}</p>
        </div>

        <div className="success-option-card">
          <h3>Order Number</h3>
          <p>{order?.order_number || "Generated"}</p>
        </div>

        <div className="success-option-card">
          <h3>Status</h3>
          <p>{order?.status || "Pending"}</p>
        </div>
      </div>

      <Link to="/track-order">
        <button className="primary-btn">Track Order</button>
      </Link>
    </div>
  );
}

export default OrderSuccess;