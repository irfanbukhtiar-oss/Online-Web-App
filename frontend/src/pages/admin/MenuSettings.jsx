import { useEffect, useState } from "react";

import {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItem
} from "../../services/menuService";

import {
  getAllDeals,
  addDeal,
  updateDeal,
  deleteDeal,
  toggleDeal
} from "../../services/dealService";

function MenuSettings() {
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);

  const [menuForm, setMenuForm] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    description: ""
  });

  const [dealForm, setDealForm] = useState({
    id: null,
    name: "",
    items_description: "",
    price: ""
  });

  const loadData = async () => {
    const menuRes = await getAllMenuItems();
    const dealRes = await getAllDeals();

    setMenuItems(menuRes.items || []);
    setDeals(dealRes.deals || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveMenuItem = async (e) => {
    e.preventDefault();

    if (menuForm.id) {
      await updateMenuItem(menuForm.id, menuForm);
    } else {
      await addMenuItem(menuForm);
    }

    setMenuForm({
      id: null,
      name: "",
      category: "",
      price: "",
      description: ""
    });

    loadData();
  };

  const saveDeal = async (e) => {
    e.preventDefault();

    if (dealForm.id) {
      await updateDeal(dealForm.id, dealForm);
    } else {
      await addDeal(dealForm);
    }

    setDealForm({
      id: null,
      name: "",
      items_description: "",
      price: ""
    });

    loadData();
  };

  return (
    <div className="admin-layout">
      <h1>Admin Menu Settings</h1>

      <div className="grid">
        <div className="card">
          <h2>{menuForm.id ? "Edit Menu Item" : "Add Menu Item"}</h2>

          <form onSubmit={saveMenuItem}>
            <div className="form-group">
              <label>Name</label>
              <input
                value={menuForm.name}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                value={menuForm.category}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, category: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={menuForm.price}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, price: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={menuForm.description}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, description: e.target.value })
                }
              />
            </div>

            <button className="primary-btn">
              {menuForm.id ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>{dealForm.id ? "Edit Deal" : "Add Deal"}</h2>

          <form onSubmit={saveDeal}>
            <div className="form-group">
              <label>Deal Name</label>
              <input
                value={dealForm.name}
                onChange={(e) =>
                  setDealForm({ ...dealForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Items Description</label>
              <textarea
                value={dealForm.items_description}
                onChange={(e) =>
                  setDealForm({
                    ...dealForm,
                    items_description: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={dealForm.price}
                onChange={(e) =>
                  setDealForm({ ...dealForm, price: e.target.value })
                }
                required
              />
            </div>

            <button className="primary-btn">
              {dealForm.id ? "Update Deal" : "Add Deal"}
            </button>
          </form>
        </div>
      </div>

      <h2>Menu Items</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rs. {item.price}</td>
                <td>{item.is_active ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => setMenuForm(item)}>Edit</button>{" "}
                  <button onClick={() => toggleMenuItem(item.id).then(loadData)}>
                    Toggle
                  </button>{" "}
                  <button onClick={() => deleteMenuItem(item.id).then(loadData)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Deals</h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Items</th>
              <th>Price</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.name}</td>
                <td>{deal.items_description}</td>
                <td>Rs. {deal.price}</td>
                <td>{deal.is_active ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => setDealForm(deal)}>Edit</button>{" "}
                  <button onClick={() => toggleDeal(deal.id).then(loadData)}>
                    Toggle
                  </button>{" "}
                  <button onClick={() => deleteDeal(deal.id).then(loadData)}>
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

export default MenuSettings;