import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    contact: "",
    assigned_branches: "BROAST CHASERS",
    default_branch: "BROAST CHASERS",
    role: "Order Taker",
    discount_cap: 0,
    wrap_categories: false,
    tablet_user: false,
    show_category_first: false,
    show_service_charges_on_tablet: false,
    tax_verified: false,
    show_payment_section_on_tablet: false,
    pos_quick_service: false,
    quick_pos_quantity_selection: false
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    console.log("User form data:", form);
    alert("User profile saved locally. Backend connection will be added next.");
  };

  return (
    <div className="user-page">
      <div className="user-header">
        <div className="user-header-icon">👤</div>

        <div>
          <h1>{id ? "User Profile" : "Add User"}</h1>
          <p>Manage account details and access privileges.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="user-profile-grid">
          <div className="user-card">
            <div className="user-card-title">
              <div className="user-card-title-icon">👤</div>
              <span>Account Information</span>
            </div>

            <input
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              required
            />

            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required={!id}
            />

            <input
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => updateField("contact", e.target.value)}
            />

            <select
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Order Taker</option>
              <option>Rider</option>
            </select>

            <input
              placeholder="Assigned Branches"
              value={form.assigned_branches}
              onChange={(e) =>
                updateField("assigned_branches", e.target.value)
              }
            />

            <input
              placeholder="Default Branch"
              value={form.default_branch}
              onChange={(e) => updateField("default_branch", e.target.value)}
              required
            />
          </div>

          <div className="user-card">
            <div className="user-card-title">
              <div className="user-card-title-icon">🛡</div>
              <span>Access & Privileges</span>
            </div>

            <label>Discount Cap %</label>
            <input
              type="number"
              value={form.discount_cap}
              onChange={(e) => updateField("discount_cap", e.target.value)}
            />

            <div className="privilege-grid">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.wrap_categories}
                  onChange={(e) =>
                    updateField("wrap_categories", e.target.checked)
                  }
                />
                Wrap Categories
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.tablet_user}
                  onChange={(e) =>
                    updateField("tablet_user", e.target.checked)
                  }
                />
                Tablet User
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.show_category_first}
                  onChange={(e) =>
                    updateField("show_category_first", e.target.checked)
                  }
                />
                Show Category First
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.show_service_charges_on_tablet}
                  onChange={(e) =>
                    updateField(
                      "show_service_charges_on_tablet",
                      e.target.checked
                    )
                  }
                />
                Show Service Charges on Tablet
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.tax_verified}
                  onChange={(e) =>
                    updateField("tax_verified", e.target.checked)
                  }
                />
                Tax Verified
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.show_payment_section_on_tablet}
                  onChange={(e) =>
                    updateField(
                      "show_payment_section_on_tablet",
                      e.target.checked
                    )
                  }
                />
                Show Payment Section on Tablet
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.pos_quick_service}
                  onChange={(e) =>
                    updateField("pos_quick_service", e.target.checked)
                  }
                />
                POS Quick Service
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.quick_pos_quantity_selection}
                  onChange={(e) =>
                    updateField(
                      "quick_pos_quantity_selection",
                      e.target.checked
                    )
                  }
                />
                Quick POS Quantity Selection
              </label>
            </div>
          </div>
        </div>

        <div className="user-save-bar">
          <Link to="/admin/users">
            <button type="button" className="secondary-btn">
              Cancel
            </button>
          </Link>

          <button type="submit" className="primary-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfile;