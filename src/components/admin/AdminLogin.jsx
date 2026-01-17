import React, { useState } from "react";
import api from "../../api/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      if (res.data.user.role !== "admin") {
        toast.error("Access Denied: You are not an admin");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(res.data.user));
      toast.success("Welcome Admin!");

      navigate("/admin/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}