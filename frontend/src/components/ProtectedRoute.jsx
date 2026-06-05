import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false, allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin" && user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();

    const hasAccess = allowedRoles
      .map((role) => role.toLowerCase())
      .includes(userRole);

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;