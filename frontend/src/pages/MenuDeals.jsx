import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import MenuItemCard from "../components/MenuItemCard";
import DealCard from "../components/DealCard";
import Cart from "../components/Cart";

import { getActiveMenuItems } from "../services/menuService";
import { getActiveDeals } from "../services/dealService";

function MenuDeals() {
  const location = useLocation();

  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryRefs = useRef({});
  const dealsRef = useRef(null);
  const menuRef = useRef(null);

  const loadData = async () => {
    try {
      const menuRes = await getActiveMenuItems();
      const dealRes = await getActiveDeals();

      setMenuItems(menuRes.items || []);
      setDeals(dealRes.deals || []);
    } catch (error) {
      console.error("Failed to load menu/deals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loading) return;

    setTimeout(() => {
      if (location.hash === "#deals" && dealsRef.current) {
        dealsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      if (location.hash === "#menu" && menuRef.current) {
        menuRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 300);
  }, [location.hash, loading, menuItems, deals]);

  const groupedMenu = useMemo(() => {
    return menuItems.reduce((groups, item) => {
      const category = item.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);

      return groups;
    }, {});
  }, [menuItems]);

  const categories = Object.keys(groupedMenu);

  const scrollToCategory = (category) => {
    const target = categoryRefs.current[category];

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const scrollToDeals = () => {
    if (dealsRef.current) {
      dealsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  if (loading) {
    return <div className="section">Loading menu...</div>;
  }

  return (
    <div className="menu-layout">
      <div>
        <section id="menu" ref={menuRef}>
          <h1 className="menu-section-title">Menu</h1>

          <div className="category-tabs sticky-category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className="category-btn"
                onClick={() => scrollToCategory(category)}
              >
                {category}
              </button>
            ))}

            <button className="category-btn deals-tab-btn" onClick={scrollToDeals}>
              Deals
            </button>
          </div>

          {categories.length === 0 ? (
            <p>No menu items available.</p>
          ) : (
            categories.map((category) => (
              <div
                key={category}
                ref={(el) => {
                  categoryRefs.current[category] = el;
                }}
                className="category-block"
              >
                <h2 className="category-heading">{category}</h2>

                <div className="product-grid">
                  {groupedMenu[category].map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        <section id="deals" ref={dealsRef} className="category-block">
          <h1 className="menu-section-title">Deals</h1>

          <div className="product-grid">
            {deals.length === 0 ? (
              <p>No deals available.</p>
            ) : (
              deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            )}
          </div>
        </section>
      </div>

      <Cart />
    </div>
  );
}

export default MenuDeals;