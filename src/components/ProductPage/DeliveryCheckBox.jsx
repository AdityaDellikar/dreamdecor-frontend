import React, { useState, useEffect } from "react";
import api from "../../api/apiClient";
import { FiMapPin } from "react-icons/fi";

export default function DeliveryCheckBox() {
  const [pincode, setPincode] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load saved pincode
  useEffect(() => {
    const saved = localStorage.getItem("userPincode");
    if (saved) {
      setPincode(saved);
      checkPincode(saved);
    }
  }, []);

  const checkPincode = async (pin) => {
    if (!pin || pin.length < 6) return;

    setLoading(true);
    try {
      const res = await api.get(`/pincodes/check/${pin}`);
      setInfo(res.data);

      localStorage.setItem("userPincode", pin);
    } catch (err) {
      console.error(err);
      setInfo({ serviceable: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkPincode(pincode);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 mt-6">
      <h3 className="font-semibold flex items-center gap-2 text-lg">
        <FiMapPin className="text-[var(--brand)]" />
        Check Delivery Availability
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3 mt-3">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="border px-3 py-2 rounded w-40"
          placeholder="Enter pincode"
        />
        <button
          className="px-4 py-2 bg-[var(--brand)] text-white rounded hover:bg-[#672828]"
        >
          Check
        </button>
      </form>

      {/* RESULT */}
      {loading && <p className="mt-3 text-gray-500">Checking…</p>}

      {info && !loading && (
        <div className="mt-3">
          {info.serviceable ? (
            <>
              <p className="text-green-600 font-semibold">
                Delivery available to {info.city}, {info.state}
              </p>

              <p className="text-gray-700">
                Estimated Delivery:{" "}
                <span className="font-semibold">{info.estimate} days</span>
              </p>

              <p className="text-gray-700">
                COD:{" "}
                <span className="font-semibold">
                  {info.cod ? "Available" : "Not available"}
                </span>
              </p>
            </>
          ) : (
            <p className="text-red-600 font-semibold">
              Sorry, we do not deliver to this pincode yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}