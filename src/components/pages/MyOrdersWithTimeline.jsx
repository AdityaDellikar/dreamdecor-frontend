// src/components/orders/MyOrdersWithTimeline.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/apiClient";
//import AdminLayout from "../admin/AdminLayout"; // or your normal layout
import { format } from "date-fns";

function shortTitle(status) {
  // short friendly label
  return status;
}

function latestEventLabel(tracking = []) {
  if (!tracking || tracking.length === 0) return "Ordered";
  const last = tracking[tracking.length - 1];
  const when = last.timestamp ? format(new Date(last.timestamp), "dd MMM yyyy, HH:mm") : "";
  return `${last.status}${when ? " — " + when : ""}`;
}

export default function MyOrdersWithTimeline() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-4 pt-24 md:p-6 md:pt-28">Loading orders…</div>;

  return (
    <div className="container mx-auto px-4 py-6 pt-24 md:px-6 md:py-8 md:pt-28">
      <h1 className="text-xl md:text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 && <div>No orders yet.</div>}
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4 md:flex-row md:justify-between"
          >
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-500">Order #{order._id.slice(-8)}</div>
              <div className="text-base font-semibold mt-1">₹{order.totalPrice}</div>
              <div className="text-xs text-gray-600 mt-1">{latestEventLabel(order.tracking)}</div>
              {/* Small horizontal mini-timeline */}
              <div className="overflow-x-auto no-scrollbar mt-2">
                <div className="flex items-center gap-3 min-w-max">
                  {["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"].map((s) => {
                    const done = order.tracking?.some((t) => t.status === s);
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${done ? "bg-[var(--brand)]" : "bg-gray-300"}`} />
                        <div className="text-xs text-gray-600 hidden sm:block">{shortTitle(s)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2 md:pt-0 md:items-center">
              <Link
                to={`/order/${order._id}/tracking`}
                className="
                  px-4 py-2
                  bg-[var(--brand)] text-white rounded
                  flex-1 text-center
                  md:flex-none md:px-5 md:py-2 md:text-sm
                "
              >
                Track
              </Link>
              <Link
                to={`/order/${order._id}`}
                className="
                  px-4 py-2
                  border rounded text-sm
                  flex-1 text-center
                  md:flex-none md:px-5 md:py-2
                "
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}