// src/components/admin/AdminPincodes.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import adminApi from "../../api/adminApi";
import toast from "react-hot-toast";

export default function AdminPincodes() {
  const [pincodes, setPincodes] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // UI state
  const [selected, setSelected] = useState(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [newPin, setNewPin] = useState({
    pincode: "",
    city: "",
    district: "",
    state: "",
    isServiceable: true,
    codAvailable: true,
    deliveryEstimate: 5,
  });

  const [csvFile, setCsvFile] = useState(null);

  // Load page
  const load = async (opts = {}) => {
    setLoading(true);
    try {
      const res = await adminApi.getPincodes({
        page: opts.page ?? page,
        limit: opts.limit ?? limit,
        search: opts.search ?? search,
        state: opts.state ?? stateFilter,
      });
      const data = res.data;
      setPincodes(data.pincodes || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
      setLimit(data.limit || limit);
      setTotal(data.total || 0);
      setSelected(new Set());
    } catch (err) {
      console.error("Failed to load pincodes", err);
      toast.error("Failed to load pincodes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pagination handlers
  const goToPage = (p) => {
    if (p < 1 || p > pages) return;
    load({ page: p });
  };

  const toggleSelect = (pincode) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(pincode)) s.delete(pincode);
      else s.add(pincode);
      return s;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === pincodes.length) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(pincodes.map((p) => p.pincode)));
  };

  // Bulk actions
  const bulkAction = async (action) => {
    if (selected.size === 0) {
      toast.error("Select at least one pincode");
      return;
    }
    const ids = Array.from(selected);
    try {
      await adminApi.bulkUpdatePincodes({ action, ids });
      toast.success("Bulk update applied");
      load(); // refresh
    } catch (err) {
      console.error("bulk update failed", err);
      toast.error("Bulk update failed");
    }
  };

  // Create new pincode
  const createNew = async () => {
    if (!newPin.pincode) return toast.error("Add pincode");
    try {
      await adminApi.createPincode(newPin);
      toast.success("Pincode created");
      setShowAdd(false);
      setNewPin({
        pincode: "",
        city: "",
        district: "",
        state: "",
        isServiceable: true,
        codAvailable: true,
        deliveryEstimate: 5,
      });
      load({ page: 1 });
    } catch (err) {
      console.error("create pincode failed", err);
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  // CSV upload
  const uploadCSV = async () => {
    if (!csvFile) return toast.error("Choose CSV file");
    try {
      await adminApi.uploadPincodesCSV(csvFile);
      toast.success("CSV uploaded");
      setCsvFile(null);
      load({ page: 1 });
    } catch (err) {
      console.error("CSV upload failed", err);
      toast.error("CSV upload failed");
    }
  };

  // Single edit modal will reuse existing AdminPincodes row "Edit" -> open native browser prompt or modal
  const editSingle = async (p) => {
    // open prompt for simplicity; site admin can later make a full modal:
    const isServiceable = window.prompt("Serviceable (true/false)", String(p.isServiceable)) ?? String(p.isServiceable);
    const codAvailable = window.prompt("COD available (true/false)", String(p.codAvailable)) ?? String(p.codAvailable);
    const days = window.prompt("Delivery days", String(p.deliveryEstimate)) ?? String(p.deliveryEstimate);
    const city = window.prompt("City", p.city) ?? p.city;
    const district = window.prompt("District", p.district) ?? p.district;
    const state = window.prompt("State", p.state) ?? p.state;

    try {
      await adminApi.updatePincode(p.pincode, {
        isServiceable: isServiceable === "true",
        codAvailable: codAvailable === "true",
        deliveryEstimate: Number(days) || 5,
        city,
        district,
        state,
      });
      toast.success("Saved");
      load();
    } catch (err) {
      console.error("single update failed", err);
      toast.error("Update failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pincode Management</h1>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-[var(--brand)] text-white rounded"
          >
            + Add New
          </button>

          <label className="flex items-center gap-2 border px-3 py-2 rounded bg-white">
            CSV
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
              className="ml-2"
            />
          </label>
          <button onClick={uploadCSV} className="px-3 py-2 border rounded">Upload CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pincode..."
          className="border px-3 py-2 rounded"
        />
        <input
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          placeholder="State filter"
          className="border px-3 py-2 rounded"
        />
        <button onClick={() => load({ page: 1, search, state: stateFilter })} className="px-3 py-2 bg-gray-200 rounded">Apply</button>
        <button onClick={() => { setSearch(""); setStateFilter(""); load({ page: 1, search: "", state: "" }); }} className="px-3 py-2 border rounded">Reset</button>
      </div>

      {/* Bulk actions */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => bulkAction("enable")} className="px-3 py-2 bg-green-500 text-white rounded">Enable Selected</button>
        <button onClick={() => bulkAction("disable")} className="px-3 py-2 bg-red-500 text-white rounded">Disable Selected</button>
        <button onClick={() => {
          const days = Number(window.prompt("Set delivery days for selected:", "5"));
          if (!Number.isNaN(days)) adminApi.bulkUpdatePincodes({ action: "setDays", ids: Array.from(selected), days }).then(() => load()).catch(() => toast.error("Failed"));
        }} className="px-3 py-2 border rounded">Set Days for Selected</button>

        <div className="ml-auto flex items-center gap-2">
          <label>Per page:</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); load({ page: 1, limit: Number(e.target.value) }); }} className="border px-2 py-1 rounded">
            {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3 w-12"><input type="checkbox" onChange={toggleSelectAll} checked={selected.size === pincodes.length && pincodes.length > 0} /></th>
              <th className="p-3">Pincode</th>
              <th className="p-3">City</th>
              <th className="p-3">State</th>
              <th className="p-3">Serviceable</th>
              <th className="p-3">COD</th>
              <th className="p-3">Days</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-6 text-center">Loading…</td></tr>
            ) : pincodes.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center">No pincodes</td></tr>
            ) : (
              pincodes.map((p) => (
                <tr key={p.pincode} className="border-b">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.pincode)}
                      onChange={() => toggleSelect(p.pincode)}
                    />
                  </td>
                  <td className="p-3">{p.pincode}</td>
                  <td className="p-3">{p.city}</td>
                  <td className="p-3">{p.state}</td>
                  <td className="p-3">{p.isServiceable ? "Yes" : "No"}</td>
                  <td className="p-3">{p.codAvailable ? "Yes" : "No"}</td>
                  <td className="p-3">{p.deliveryEstimate} days</td>
                  <td className="p-3 text-right">
                    <button onClick={() => editSingle(p)} className="px-3 py-1 bg-yellow-200 rounded">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div>
          Page {page} of {pages} — {total} pincodes
        </div>

        <div className="flex gap-2">
          <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-3 py-1 border rounded">Prev</button>
          {Array.from({ length: pages }).slice(0, 10).map((_, i) => {
            const p = i + 1;
            if (p > pages) return null;
            return (
              <button key={p} onClick={() => goToPage(p)} className={`px-3 py-1 rounded ${p === page ? "bg-[var(--brand)] text-white" : "border"}`}>{p}</button>
            );
          })}
          <button onClick={() => goToPage(page + 1)} disabled={page >= pages} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96 space-y-3">
            <h2 className="text-lg font-semibold">Add Pincode</h2>

            <input placeholder="Pincode" className="w-full border px-3 py-2 rounded" value={newPin.pincode} onChange={(e) => setNewPin({ ...newPin, pincode: e.target.value })} />
            <input placeholder="City" className="w-full border px-3 py-2 rounded" value={newPin.city} onChange={(e) => setNewPin({ ...newPin, city: e.target.value })} />
            <input placeholder="District" className="w-full border px-3 py-2 rounded" value={newPin.district} onChange={(e) => setNewPin({ ...newPin, district: e.target.value })} />
            <input placeholder="State" className="w-full border px-3 py-2 rounded" value={newPin.state} onChange={(e) => setNewPin({ ...newPin, state: e.target.value })} />

            <div className="flex gap-2">
              <label className="flex items-center gap-2"><input type="checkbox" checked={newPin.isServiceable} onChange={(e) => setNewPin({ ...newPin, isServiceable: e.target.checked })} /> Serviceable</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={newPin.codAvailable} onChange={(e) => setNewPin({ ...newPin, codAvailable: e.target.checked })} /> COD</label>
            </div>

            <input type="number" min="1" className="w-full border px-3 py-2 rounded" value={newPin.deliveryEstimate} onChange={(e) => setNewPin({ ...newPin, deliveryEstimate: Number(e.target.value) })} />

            <div className="flex justify-end gap-2">
              <button className="px-3 py-2 border rounded" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="px-3 py-2 bg-[var(--brand)] text-white rounded" onClick={createNew}>Create</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}