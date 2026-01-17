import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
  });

  const [loading, setLoading] = useState(true);

  //  ADMIN LOGOUT
  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    toast.success("Admin logged out");
    navigate("/admin");
  };

  //  Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, orders, products] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/orders"),
          api.get("/admin/products"),
        ]);

        setStats({
          users: users.data.users.length,
          orders: orders.data.orders.length,
          products: products.data.products.length,
        });
      } catch (err) {
        toast.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-600">Loading stats...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/*  Logout Button */}
        <button
          onClick={logoutAdmin}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-4xl font-bold mt-2">{stats.users}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-4xl font-bold mt-2">{stats.orders}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-4xl font-bold mt-2">{stats.products}</p>
        </div>
      </div>
    </AdminLayout>
  );
}