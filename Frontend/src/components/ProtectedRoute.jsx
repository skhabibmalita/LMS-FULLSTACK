import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user) {
    const userRole = String(user.role || "").toLowerCase();
    if (userRole !== requiredRole.toLowerCase()) {
      // Redirect to their own dashboard
      return <Navigate to={userRole === "student" ? "/student" : "/dashboard"} replace />;
    }
  }

  // If token exists and role matches (or no role required), allow access
  return children;
}

export default ProtectedRoute;
