import { Link, useLocation, useParams } from "react-router-dom";

function OrderSuccess() {
  const { trackingNumber } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  return (
    <div className="success-box">
      <h2>Order placed successfully</h2>

      <div className="info-line">
        <strong>Tracking Number:</strong>{" "}
        {order?.tracking_number || trackingNumber}
      </div>

      <div className="info-line">
        <strong>Order Number:</strong>{" "}
        {order?.order_number || "Generated"}
      </div>

      <div className="info-line">
        <strong>Status:</strong>{" "}
        {order?.status || "Pending Confirmation"}
      </div>

      <Link to="/track-order">
        <button className="primary-btn">Track Order</button>
      </Link>
    </div>
  );
}

export default OrderSuccess;