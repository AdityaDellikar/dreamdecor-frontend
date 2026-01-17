import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  // If not logged in → redirect to Login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}