import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout } = useAuth();

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
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
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