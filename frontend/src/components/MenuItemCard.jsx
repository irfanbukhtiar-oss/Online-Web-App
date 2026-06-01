import { useCart } from "../context/CartContext";

function MenuItemCard({ item }) {
  const { addToCart } = useCart();

  const fallbackImage =
    "https://via.placeholder.com/300x200?text=Menu+Item";

  return (
    <div className="product-card">
      <img
        src={item.image_url || fallbackImage}
        alt={item.name}
        className="product-image"
      />

      <div className="product-info">
        <h3>{item.name}</h3>
        <p>{item.description || "Freshly prepared item."}</p>
        <p className="price">Rs. {item.price}</p>

        <button
          className="add-btn"
          onClick={() =>
            addToCart({
              item_type: "menu",
              item_id: item.id,
              name: item.name,
              price: item.price,
              quantity: 1
            })
          }
        >
          Add +
        </button>
      </div>
    </div>
  );
}

export default MenuItemCard;