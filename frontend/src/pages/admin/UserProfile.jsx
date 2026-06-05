import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createUser,
  getUserById,
  updateUser
} from "../../services/userService";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    username: "",
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
    quick_pos_quantity_selection: false,
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);

        const res = await getUserById(id);
        const user = res.user;

        setForm({
          username: user.username || "",
          full_name: user.full_name || "",
          email: user.email || "",
          password: "",
          contact: user.contact || "",
          assigned_branches: user.assigned_branches || "BROAST CHASERS",
          default_branch: user.default_branch || "BROAST CHASERS",
          role: user.role || "Order Taker",
          discount_cap: user.discount_cap || 0,
          wrap_categories: Boolean(user.wrap_categories),
          tablet_user: Boolean(user.tablet_user),
          show_category_first: Boolean(user.show_category_first),
          show_service_charges_on_tablet: Boolean(
            user.show_service_charges_on_tablet
          ),
          tax_verified: Boolean(user.tax_verified),
          show_payment_section_on_tablet: Boolean(
            user.show_payment_section_on_tablet
          ),
          pos_quick_service: Boolean(user.pos_quick_service),
          quick_pos_quantity_selection: Boolean(
            user.quick_pos_quantity_selection
          ),
          is_active: Boolean(user.is_active)
        });
      } catch (error) {
        console.error("User load error", error);
        alert("Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, isEditMode]);

  const validateForm = () => {
    if (!form.username.trim()) {
      alert("Username is required.");
      return false;
    }

    if (!isEditMode && !form.password.trim()) {
      alert("Password is required for new user.");
      return false;
    }

    if (!form.default_branch.trim()) {
      alert("Default branch is required.");
      return false;
    }

    return true;
  };

  const buildPayload = () => {
    return {
      username: form.username.trim(),
      password: form.password,
      full_name: form.full_name,
      email: form.email,
      contact: form.contact,
      role: form.role,
      assigned_branches: form.assigned_branches,
      default_branch: form.default_branch,
      discount_cap: Number(form.discount_cap || 0),
      wrap_categories: form.wrap_categories,
      tablet_user: form.tablet_user,
      show_category_first: form.show_category_first,
      show_service_charges_on_tablet:
        form.show_service_charges_on_tablet,
      tax_verified: form.tax_verified,
      show_payment_section_on_tablet:
        form.show_payment_section_on_tablet,
      pos_quick_service: form.pos_quick_service,
      quick_pos_quantity_selection:
        form.quick_pos_quantity_selection,
      is_active: form.is_active
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = buildPayload();

      if (isEditMode) {
        await updateUser(id, payload);
        alert("User updated successfully.");
      } else {
        await createUser(payload);
        alert("User created successfully.");
      }

      navigate("/admin/users");
    } catch (error) {
      console.error("User save error", error);

      alert(
        error?.response?.data?.message ||
          "Failed to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-page">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-header">
        <div className="user-header-icon">👤</div>

        <div>
          <h1>{isEditMode ? "User Profile" : "Add User"}</h1>
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
              placeholder="Username"
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
              required
            />

            <input
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
            />

            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />

            <input
              placeholder={
                isEditMode
                  ? "New Password - leave blank to keep current"
                  : "Password"
              }
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required={!isEditMode}
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
              onChange={(e) =>
                updateField("default_branch", e.target.value)
              }
              required
            />

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  updateField("is_active", e.target.checked)
                }
              />
              Active User
            </label>
          </div>

          <div className="user-card">
            <div className="user-card-title">
              <div className="user-card-title-icon">🛡</div>
              <span>Access & Privileges</span>
            </div>

            <label>Discount Cap %</label>
            <input
              type="number"
              min="0"
              value={form.discount_cap}
              onChange={(e) =>
                updateField("discount_cap", e.target.value)
              }
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

          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfile;