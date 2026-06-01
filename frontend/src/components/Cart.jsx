import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getTotal
  } = useCart();

  return (
    <aside className="cart-box">
      <h2>Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={`${item.item_type}-${item.item_id}`}>
              <strong>{item.name}</strong>
              <p>Rs. {item.price}</p>

              <div className="cart-controls">
                <button onClick={() => decreaseQty(item.item_type, item.item_id)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.item_type, item.item_id)}>
                  +
                </button>
                <button onClick={() => removeFromCart(item.item_type, item.item_id)}>
                  x
                </button>
              </div>

              <p>Subtotal: Rs. {item.price * item.quantity}</p>
            </div>
          ))}

          <div className="cart-total">Total: Rs. {getTotal()}</div>

          <button className="primary-btn" onClick={() => navigate("/checkout")}>
            Order Now
          </button>
        </>
      )}
    </aside>
  );
}

export default Cart;