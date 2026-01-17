// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("admin"));

  // If not logged in as admin → redirect to /admin (AdminLogin)
  if (!admin || admin.role !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}