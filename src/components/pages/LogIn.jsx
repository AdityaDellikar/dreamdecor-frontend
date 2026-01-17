import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function LogIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error("Invalid login response");
      }

      // 🔐 Sync with AuthContext (single source of truth)
      login(user, token);

      toast.success(`Welcome back, ${user.name || "User"} 👋`);

      // Smooth redirect (SPA-safe)
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[var(--cream)]">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Log In
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-lg text-white
              bg-black hover:bg-gray-900
              transition disabled:opacity-60
            "
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}