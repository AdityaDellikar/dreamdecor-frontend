// src/components/admin/AdminOrderDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import adminApi from "../../api/adminApi";
import toast from "react-hot-toast";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // tracking form
  const [status, setStatus] = useState("Packed");
  const [message, setMessage] = useState("");

  // cancellation handling state
  const [processingCancel, setProcessingCancel] = useState(false);
  const [refundNow, setRefundNow] = useState(false);

  const STATUS_LIST = [
    "Ordered",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrder(id);
      setOrder(res.data.order);
    } catch (err) {
      console.error("loadOrder error:", err);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const addTrackingEvent = async () => {
    try {
      await adminApi.addTracking(id, { status, message });
      toast.success("Tracking updated!");
      await loadOrder();
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tracking");
    }
  };

  // Approve cancellation
  const approveCancellation = async () => {
    if (!order?.cancellation?.requested) {
      toast.error("No cancellation request found");
      return;
    }

    const confirmMsg = refundNow
      ? "Approve cancellation and initiate refund now?"
      : "Approve cancellation (refund will be handled later)?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setProcessingCancel(true);
      await adminApi.handleCancellationAdmin(order._id, { action: "approve", refundNow });
      toast.success("Cancellation approved");
      setRefundNow(false);
      await loadOrder();
    } catch (err) {
      console.error("approveCancellation error:", err);
      const errMsg = err?.response?.data?.message || "Failed to approve cancellation";
      toast.error(errMsg);
    } finally {
      setProcessingCancel(false);
    }
  };

  // Reject cancellation
  const rejectCancellation = async () => {
    if (!order?.cancellation?.requested) {
      toast.error("No cancellation request found");
      return;
    }

    if (!window.confirm("Reject the cancellation request?")) return;

    try {
      setProcessingCancel(true);
      await adminApi.handleCancellationAdmin(order._id, { action: "reject" });
      toast.success("Cancellation rejected");
      await loadOrder();
    } catch (err) {
      console.error("rejectCancellation error:", err);
      const errMsg = err?.response?.data?.message || "Failed to reject cancellation";
      toast.error(errMsg);
    } finally {
      setProcessingCancel(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading order...</p>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <p className="text-red-600">Order not found</p>
      </AdminLayout>
    );
  }

  const cancellation = order.cancellation;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">
        Order #{order._id.slice(-6)}
      </h1>

      {/* ------------------- Order Summary ------------------- */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <p className="font-semibold text-lg">Order Summary</p>
        <p>Total Price: ₹{order.totalPrice}</p>
        <p>Payment: {order.paymentMethod}</p>
        <p>Status: {order.status}</p>
      </div>

      {/* --------------------- Items --------------------- */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <p className="font-semibold text-lg mb-2">Items</p>
        {order.items.map((item) => (
          <div key={String(item.productId)} className="border-b py-2">
            <p>{item.name}</p>
            <p>Qty: {item.qty}</p>
            {item.selectedSize?.label && (
              <p className="text-xs text-gray-600">
                Size: {item.selectedSize.label}
              </p>
            )}
            <p>Price: ₹{item.price}</p>
          </div>
        ))}
      </div>

      {/* --------------------- Address --------------------- */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <p className="font-semibold text-lg mb-2">Shipping Address</p>
        <p>{order.shippingAddress.fullName}</p>
        <p>{order.shippingAddress.address1}</p>
        <p>{order.shippingAddress.address2}</p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
          {order.shippingAddress.postalCode}
        </p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>

      {/* --------------------- Cancellation Panel --------------------- */}
      {cancellation?.requested && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Cancellation Request</h3>

          <div className="text-sm text-gray-700 mb-2">
            <p><strong>Requested At:</strong> {new Date(cancellation.requestedAt).toLocaleString()}</p>
            <p><strong>Reason:</strong> {cancellation.reasonFromDropdown || "—"}</p>
            {cancellation.message && <p><strong>Message:</strong> {cancellation.message}</p>}
            <p><strong>Contact:</strong> {cancellation.byUserContact || "—"}</p>
            <p className="text-xs text-gray-600 mt-2">If you need assistance contact +91 123457890 via WhatsApp.</p>
          </div>

          {!cancellation.processed ? (
            <div className="flex items-center gap-3 mt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={refundNow}
                  onChange={(e) => setRefundNow(e.target.checked)}
                />
                Initiate refund now (if payment was online)
              </label>

              <button
                onClick={approveCancellation}
                disabled={processingCancel}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {processingCancel ? "Processing..." : "Approve Cancellation"}
              </button>

              <button
                onClick={rejectCancellation}
                disabled={processingCancel}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {processingCancel ? "Processing..." : "Reject Cancellation"}
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm">Processed: <strong>{cancellation.result}</strong></p>
              {cancellation.refundInitiated && (
                <p className="text-sm">Refund initiated (details saved)</p>
              )}
              {cancellation.processedAt && (
                <p className="text-sm">Processed At: {new Date(cancellation.processedAt).toLocaleString()}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* --------------------- Tracking Timeline --------------------- */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <p className="font-semibold text-lg mb-2">Tracking Timeline</p>

        {order.tracking.length === 0 && <p>No tracking events yet.</p>}

        <ul className="space-y-2">
          {order.tracking.map((t, i) => (
            <li key={i} className="border-l-4 border-blue-600 pl-3">
              <p className="font-semibold">{t.status}</p>
              {t.message && <p className="text-gray-600">{t.message}</p>}
              <p className="text-sm text-gray-500">
                {new Date(t.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ------------------ Add Tracking Event (ADMIN) ------------------ */}
      <div className="bg-white p-4 shadow rounded">
        <p className="font-semibold text-lg mb-3">Add Tracking Event</p>

        <label className="block mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-3"
        >
          {STATUS_LIST.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label className="block mb-1">Message (optional)</label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-3"
          placeholder="Eg: Package scanned at warehouse"
        />

        <button
          onClick={addTrackingEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Tracking Update
        </button>
      </div>
    </AdminLayout>
  );
}