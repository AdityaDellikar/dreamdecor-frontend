import React, { useState } from "react";
import api from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function LogIn() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form, {
        withCredentials: true,
      });

      login(res.data.user); // store user globally

      toast.success("Login successful!");

      window.location.href = "/";
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);

      toast.error(message);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Log In</h2>

        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
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

          <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}