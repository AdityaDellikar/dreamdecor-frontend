import React, { useState } from "react";
import ticketApi from "../../api/ticketApi";
import toast from "react-hot-toast";

export default function RaiseTicketModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitTicket = async () => {
    const { name, email, whatsapp, message } = form;

    if (!name || !email || !whatsapp || !message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await ticketApi.createTicket(form);

      toast.success(
        "🎧 Our customer executive will contact you on WhatsApp within 24 hours."
      );

      onClose();
      setForm({ name: "", email: "", whatsapp: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to raise ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-1">Raise a Support Ticket</h2>
        <p className="text-sm text-gray-600 mb-4">
          Our team will assist you as soon as possible.
        </p>

        <div className="space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="whatsapp"
            placeholder="WhatsApp Number"
            value={form.whatsapp}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="message"
            placeholder="Describe your issue"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <p className="text-xs text-gray-500 mt-3">
          📞 For immediate assistance, contact us on WhatsApp at{" "}
          <b>+91 12345 7890</b>
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={submitTicket}
            disabled={loading}
            className="px-4 py-2 bg-[var(--brand)] text-white rounded"
          >
            {loading ? "Submitting..." : "Raise Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}