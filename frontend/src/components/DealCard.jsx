import { useState } from "react";
import { useCart } from "../context/CartContext";
import { API_ORIGIN } from "../services/api";

function DealCard({ deal }) {
  const { addToCart } = useCart();
  const [showDescription, setShowDescription] = useState(false);

  const imageSrc = deal.image_url
    ? deal.image_url.startsWith("http")
      ? deal.image_url
      : `${API_ORIGIN}${deal.image_url}`
    : "https://via.placeholder.com/300x200?text=Deal";

  return (
    <div className="product-card">
      <img src={imageSrc} alt={deal.name} className="product-image" />

      <div className="product-info">
        <h3>{deal.name}</h3>

        <p className="price">Rs. {deal.price}</p>

        <button
          className="description-tab"
          onClick={() => setShowDescription(!showDescription)}
        >
          Description
        </button>

        {showDescription && (
          <p className="product-description">
            {deal.items_description}
          </p>
        )}

        <button
          className="add-btn"
          onClick={() =>
            addToCart({
              item_type: "deal",
              item_id: deal.id,
              name: deal.name,
              price: deal.price,
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

export default DealCard;