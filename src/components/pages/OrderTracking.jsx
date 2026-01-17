// src/pages/OrderTracking.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/apiClient";
import { formatDistanceToNowStrict, format } from "date-fns";

const STATUS_STEPS = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function statusIndex(status) {
  const idx = STATUS_STEPS.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export default function OrderTracking() {
  const { id } = useParams();
  const [tracking, setTracking] = useState([]);
  const [status, setStatus] = useState("");
  const [courier, setCourier] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  const fetchTracking = useCallback(async () => {
    try {
      const res = await api.get(`/orders/${id}/tracking`);
      setTracking(res.data.tracking || []);
      setStatus(res.data.status || "");
      setCourier(res.data.courier || null);
    } catch (err) {
      console.error("fetchTracking:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTracking();

    // Poll every 8 seconds (adjust as needed). Stop after Delivered.
    pollingRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/orders/${id}/tracking`);
        const newTracking = res.data.tracking || [];
        setTracking(newTracking);
        setStatus(res.data.status || "");
        if ((res.data.status || "").toLowerCase() === "delivered") {
          clearInterval(pollingRef.current);
        }
      } catch (err) {
        console.error("polling error:", err);
      }
    }, 8000);

    return () => clearInterval(pollingRef.current);
  }, [fetchTracking, id]);

  const completedSteps = statusIndex(status);

  return (
    <div className="container mx-auto px-4 py-6 pt-24 md:px-6 md:py-10 md:pt-28">
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        Order Tracking
      </h1>

      {loading ? (
        <div>Loading tracking…</div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm">
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-semibold">{id}</div>
              </div>
              <div className="text-sm">
                <div className="text-sm text-gray-500">Current status</div>
                <div className="font-semibold">{status}</div>
              </div>
              {courier && (
                <div className="text-sm">
                  <div className="text-sm text-gray-500">Courier</div>
                  <div className="font-semibold">{courier.name} {courier.awb ? `(${courier.awb})` : ""}</div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="w-full h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(completedSteps / (STATUS_STEPS.length - 1)) * 100}%` }}
                  className="h-full bg-[var(--brand)] transition-width duration-500"
                />
              </div>

              <div className="flex gap-6 overflow-x-auto no-scrollbar text-xs text-gray-600 mt-3 md:justify-between">
                {STATUS_STEPS.map((s) => (
                  <div key={s} className="min-w-max text-center">
                    <div className={`mb-1 ${statusIndex(status) >= statusIndex(s) ? "text-[var(--brand)]" : ""}`}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              {tracking.length === 0 && <div className="text-gray-500">No tracking events yet.</div>}
              {tracking.map((ev, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${statusIndex(status) >= statusIndex(ev.status) ? "bg-[var(--brand)]" : "bg-gray-300"}`} />
                    <div className="h-full w-px bg-gray-200" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <div className="font-semibold">{ev.status}</div>
                      <div className="text-[11px] text-gray-500">
                        {ev.timestamp ? format(new Date(ev.timestamp), "dd MMM yyyy, HH:mm") : ""}
                        {ev.timestamp && ` · ${formatDistanceToNowStrict(new Date(ev.timestamp))} ago`}
                      </div>
                    </div>

                    {ev.location && <div className="text-sm text-gray-600 mt-1">Location: {ev.location}</div>}
                    {ev.message && <div className="text-sm text-gray-700 mt-1">{ev.message}</div>}
                    {ev.meta && typeof ev.meta === "object" && (
                      <div className="text-[11px] text-gray-400 mt-1 break-all">Meta: {JSON.stringify(ev.meta)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}