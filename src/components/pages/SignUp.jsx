import React, { useState } from "react";
import api from "../../api/apiClient";
import toast from "react-hot-toast";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/register", form);

      toast.success("Signup successful! You can now log in.");

      setSuccess(response.data.message || "Signup successful!");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";

      toast.error(msg);

      setError(msg);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}