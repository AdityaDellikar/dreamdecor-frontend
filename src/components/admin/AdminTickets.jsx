import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import ticketApi from "../../api/ticketApi";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const res = await ticketApi.getAllTickets();
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateTicket = async (id, payload) => {
    try {
      await ticketApi.updateTicket(id, payload);
      toast.success("Ticket updated");
      loadTickets();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading tickets...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>

      {tickets.length === 0 && (
        <p className="text-gray-500">No tickets found.</p>
      )}

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white rounded shadow p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-lg">{ticket.name}</p>
                <p className="text-sm text-gray-600">{ticket.email}</p>
                <p className="text-sm text-gray-600">
                  WhatsApp: {ticket.whatsapp}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded font-semibold ${
                  ticket.status === "Open"
                    ? "bg-red-100 text-red-700"
                    : ticket.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {ticket.status}
              </span>
            </div>

            {/* Message */}
            <div className="text-gray-800 mb-3">
              {ticket.message}
            </div>

            {/* Meta */}
            <div className="text-xs text-gray-500 mb-3">
              Raised on{" "}
              {format(new Date(ticket.createdAt), "dd MMM yyyy, HH:mm")}
            </div>

            {/* Admin Controls */}
            <div className="grid sm:grid-cols-3 gap-3 items-center">
              <select
                value={ticket.status}
                onChange={(e) =>
                  updateTicket(ticket._id, { status: e.target.value })
                }
                className="border px-3 py-2 rounded"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

              <input
                placeholder="Admin note (optional)"
                defaultValue={ticket.adminNote}
                onBlur={(e) =>
                  updateTicket(ticket._id, { adminNote: e.target.value })
                }
                className="border px-3 py-2 rounded col-span-2"
              />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}