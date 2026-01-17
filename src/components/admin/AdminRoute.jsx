import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("admin"));

  if (!admin) return <Navigate to="/admin" />;
  if (admin.role !== "admin") return <Navigate to="/" />;

  return children;
}