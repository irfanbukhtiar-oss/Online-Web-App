import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout } = useAuth();

  const userRole = user?.role?.toLowerCase();

  const isAdmin = userRole === "admin";
  const isManager = userRole === "manager";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          <img src={logo} alt="Broast Chasers Logo" />
          <span>Broast Chasers</span>
        </Link>

        <Link to="/menu-deals#menu">Menu</Link>
        <Link to="/menu-deals#deals">Deals</Link>
        <Link to="/track-order">Order Tracking</Link>
        <Link to="/contact">Contact Us</Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            {isAdmin && <Link to="/admin">Admin</Link>}

            {(isAdmin || isManager) && (
              <Link to="/admin/orders">Orders</Link>
            )}

            {isAdmin && (
              <>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/reports">Reports</Link>
              </>
            )}

            <Link to="/my-orders">My Orders</Link>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;