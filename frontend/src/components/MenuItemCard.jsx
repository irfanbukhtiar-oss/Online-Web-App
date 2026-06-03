import { useState } from "react";
import { useCart } from "../context/CartContext";
import { API_ORIGIN } from "../services/api";

function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const [showDescription, setShowDescription] = useState(false);

  const imageSrc = item.image_url
    ? item.image_url.startsWith("http")
      ? item.image_url
      : `${API_ORIGIN}${item.image_url}`
    : "https://via.placeholder.com/300x200?text=Menu+Item";

  return (
    <div className="product-card">
      <img src={imageSrc} alt={item.name} className="product-image" />

      <div className="product-info">
        <h3>{item.name}</h3>

        <p className="price">Rs. {item.price}</p>

        <button
          className="description-tab"
          onClick={() => setShowDescription(!showDescription)}
        >
          Description
        </button>

        {showDescription && (
          <p className="product-description">
            {item.description || "No description available."}
          </p>
        )}

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