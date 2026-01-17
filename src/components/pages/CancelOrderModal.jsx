// src/components/pages/CancelOrderModal.jsx
import React, { useState } from "react";
import orderApi from "../../api/orderApi";
import toast from "react-hot-toast";

export default function CancelOrderModal({ order, onClose, onUpdated }) {
  const [open, setOpen] = useState(true);
  const [reason, setReason] = useState("Changed my mind");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    "Changed my mind",
    "Found cheaper elsewhere",
    "Ordered by mistake",
    "Delivery too slow",
    "Other",
  ];

  const canCancel = !["Shipped", "Out for Delivery", "Delivered"].includes(order.status);

  const handleSubmit = async () => {
    if (!canCancel) {
      toast.error("Order already shipped — cannot cancel.");
      return;
    }
    try {
      setLoading(true);
      const res = await orderApi.cancelOrder(order._id, { reasonOption: reason, message });
      toast.success(res.data.message || "Cancellation requested");
      onUpdated?.();
    } catch (err) {
      console.error("cancel error:", err);
      toast.error(err?.response?.data?.message || "Cancel failed");
    } finally {
      setLoading(false);
      setOpen(false);
      onClose?.();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/40 absolute inset-0" onClick={() => { setOpen(false); onClose?.(); }} />
      <div className="bg-white rounded p-6 z-10 max-w-lg w-full">
        <h3 className="text-lg font-semibold mb-3">Cancel Order</h3>
        {!canCancel && <p className="text-red-600 mb-3">This order cannot be cancelled because it is already shipped/delivered.</p>}

        <label className="block text-sm mb-1">Reason</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border px-3 py-2 rounded mb-3">
          {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <label className="block text-sm mb-1">Message (optional)</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border rounded px-3 py-2 mb-3" rows={3} />

        <p className="text-xs text-gray-600 mb-4">If you need help, contact +91 123457890 via WhatsApp. If your order was paid online, refunds usually reflect in 3–4 business days after we initiate them.</p>

        <div className="flex justify-end gap-2">
          <button onClick={() => { setOpen(false); onClose?.(); }} className="px-4 py-2 border rounded">Close</button>
          <button onClick={handleSubmit} disabled={loading || !canCancel} className="px-4 py-2 bg-red-600 text-white rounded">
            {loading ? "Requesting..." : "Request Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}