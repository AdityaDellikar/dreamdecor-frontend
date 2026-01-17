// src/components/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import adminApi from "../../api/adminApi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const STATUS_OPTIONS = [
    "Ordered",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // Load all orders
  const loadOrders = async () => {
    try {
      const res = await adminApi.getOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update order status → call admin API
  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus); // PUT /api/admin/orders/:id/status
      toast.success("Order status updated!");
      await loadOrders();
    } catch (err) {
      console.error("updateStatus error:", err?.response?.data || err);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading orders...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 && <p className="text-gray-500">No orders found</p>}

        {orders.map((order) => (
          <div key={order._id} className="bg-white p-4 shadow rounded">
            <div className="flex justify-between items-center">
              {/* LEFT */}
              <div>
                <p className="font-bold text-lg">Order #{order._id.slice(-6)}</p>
                <p className="text-gray-600">
                  Customer: {order.user?.name} ({order.user?.email})
                </p>
                <p className="font-semibold mt-1">Total: ₹{order.totalPrice}</p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <Link to={`/admin/orders/${order._id}`}>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}