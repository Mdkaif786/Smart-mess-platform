// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  const role = localStorage.getItem("role");

  // Not logged in (no role stored)
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role for this route
  if (roleRequired && role !== roleRequired) {
    // Optional: redirect to that role's home dashboard
    if (role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }
    if (role === "mess_admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (role === "super_admin") {
      return <Navigate to="/super-admin-dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Correct role – allow access
  return children;
}

export default ProtectedRoute;