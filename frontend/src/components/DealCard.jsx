import { useCart } from "../context/CartContext";

function DealCard({ deal }) {
  const { addToCart } = useCart();

  return (
    <div className="card deal-card">
      <div>
        <h3>{deal.name}</h3>
        <p>{deal.items_description}</p>
        <p className="price">Rs. {deal.price}</p>
      </div>

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
        +
      </button>
    </div>
  );
}

export default DealCard;