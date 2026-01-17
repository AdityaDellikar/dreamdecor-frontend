//src/components/pages/Orders.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const ADDRESS_BOOK_KEY = "address_book";
const CHECKOUT_CART_KEY = "checkout_cart";

function getEstimatedDelivery(daysFrom = 3, variability = 2) {
  const add = daysFrom + Math.floor(Math.random() * (variability + 1)); // 3-5 days
  const date = new Date();
  date.setDate(date.getDate() + add);
  const opts = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString(undefined, opts);
}

export default function Checkout() {
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(-1);
  const [addressBook, setAddressBook] = useState([]);
  const [addressDraft, setAddressDraft] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  /* Load checkout cart + address book */
  useEffect(() => {
    const raw = localStorage.getItem(CHECKOUT_CART_KEY);
    if (!raw) {
      navigate("/cart");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setCheckoutData(parsed);
    } catch (err) {
      console.error("Invalid checkout_cart", err);
      navigate("/cart");
    }

    const book = JSON.parse(localStorage.getItem(ADDRESS_BOOK_KEY) || "[]");
    setAddressBook(book);

    if (book.length > 0) {
      setSelectedAddrIdx(0);
      setAddressDraft(book[0]);
    }
  }, [navigate]);

  /* Live totals using checkoutData */
  const totals = useMemo(() => {
    if (!checkoutData)
      return { itemsSubtotal: 0, discount: 0, shipping: 0, total: 0 };

    const itemsSubtotal =
      checkoutData.totals?.itemsSubtotal ??
      checkoutData.totals?.total ??
      checkoutData.totals?.totalPrice ??
      checkoutData.totals?.total ??
      0;

    const discount = checkoutData.totals?.discount ?? 0;
    const shipping = itemsSubtotal >= 999 ? 0 : 49;
    const total = itemsSubtotal - discount + shipping;

    return { itemsSubtotal, discount, shipping, total };
  }, [checkoutData]);

  /* 🟢 FIXED: Address autosave effect */
  useEffect(() => {
    if (selectedAddrIdx >= 0) {
      const updated = [...addressBook];
      updated[selectedAddrIdx] = addressDraft;
      setAddressBook(updated);
      localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(updated));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressDraft, selectedAddrIdx]);

  const handleSelectAddress = (idx) => {
    setSelectedAddrIdx(idx);
    setAddressDraft(addressBook[idx] || {
      fullName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      landmark: "",
    });
  };

  const handleAddressFieldChange = (e) => {
    const { name, value } = e.target;
    setAddressDraft((p) => ({ ...p, [name]: value }));
  };

  const handleSaveNewAddress = () => {
    const clean = { ...addressDraft };
    const updated = [clean, ...addressBook];
    setAddressBook(updated);
    localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(updated));
    setSelectedAddrIdx(0);
  };

  const handleRemoveAddress = (idx) => {
    const updated = addressBook.filter((_, i) => i !== idx);
    setAddressBook(updated);
    localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(updated));

    setSelectedAddrIdx(updated.length ? 0 : -1);
    setAddressDraft(
      updated[0] || {
        fullName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        landmark: "",
      }
    );
  };

  const placeOrder = async () => {
    setError("");

    if (
      !addressDraft.fullName ||
      !addressDraft.phone ||
      !addressDraft.address1 ||
      !addressDraft.city ||
      !addressDraft.postalCode
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const payload = {
      items: (checkoutData.cartItems || []).map((i) => ({
        productId: i.id || i._id,
        name: i.name,
        price: i.price,
        qty: i.qty || 1,
        image: (i.images && i.images[0]) || i.image || "",
      })),
      shippingAddress: { ...addressDraft },
      paymentMethod,
      itemsPrice: totals.itemsSubtotal,
      shippingPrice: totals.shipping,
      taxPrice: 0,
      totalPrice: totals.total,
    };

    try {
      setPlacingOrder(true);
      await api.post("/orders", payload);

      localStorage.removeItem(CHECKOUT_CART_KEY);
      navigate("/orders");
    } catch (err) {
      console.error("placeOrder:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Make sure you're logged in."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!checkoutData) return <div className="pt-28 text-center">Loading checkout…</div>;

  const estimatedDelivery = getEstimatedDelivery(3, 2);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[var(--cream)]">
      <div className="container mx-auto px-6">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              <span className="text-sm text-gray-600">
                Estimated: <strong>{estimatedDelivery}</strong>
              </span>
            </div>

            {/* Saved addresses */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addressBook.length === 0 && (
                <div className="text-sm text-gray-500">
                  No saved addresses yet.
                </div>
              )}

              {addressBook.map((addr, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border ${
                    selectedAddrIdx === idx
                      ? "border-[var(--brand)] bg-[rgba(176,74,61,0.05)]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium">{addr.fullName}</div>
                      <div className="text-sm text-gray-600">
                        {addr.address1}
                        {addr.address2 ? `, ${addr.address2}` : ""}, {addr.city}{" "}
                        - {addr.postalCode}
                      </div>
                      <div className="text-sm text-gray-600">
                        Phone: {addr.phone}
                      </div>
                    </div>

                    <div className="space-y-2 text-right">
                      <button
                        onClick={() => handleSelectAddress(idx)}
                        className="text-xs px-2 py-1 rounded bg-[var(--brand)] text-white"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => handleRemoveAddress(idx)}
                        className="text-xs px-2 py-1 rounded border"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add address */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="fullName" value={addressDraft.fullName} onChange={handleAddressFieldChange} placeholder="Full name *" className="border px-4 py-2 rounded-md" />
              <input name="phone" value={addressDraft.phone} onChange={handleAddressFieldChange} placeholder="Mobile *" className="border px-4 py-2 rounded-md" />
              <input name="address1" value={addressDraft.address1} onChange={handleAddressFieldChange} placeholder="Address *" className="border px-4 py-2 rounded-md sm:col-span-2" />
              <input name="address2" value={addressDraft.address2} onChange={handleAddressFieldChange} placeholder="Address 2" className="border px-4 py-2 rounded-md" />
              <input name="city" value={addressDraft.city} onChange={handleAddressFieldChange} placeholder="City *" className="border px-4 py-2 rounded-md" />
              <input name="state" value={addressDraft.state} onChange={handleAddressFieldChange} placeholder="State *" className="border px-4 py-2 rounded-md" />
              <input name="postalCode" value={addressDraft.postalCode} onChange={handleAddressFieldChange} placeholder="Pincode *" className="border px-4 py-2 rounded-md" />
              <input name="landmark" value={addressDraft.landmark} onChange={handleAddressFieldChange} placeholder="Landmark" className="border px-4 py-2 rounded-md" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleSaveNewAddress} className="px-4 py-2 bg-[var(--brand)] text-white rounded">
                Save address
              </button>
              <button
                onClick={() => {
                  setSelectedAddrIdx(-1);
                  setAddressDraft({
                    fullName: "",
                    phone: "",
                    address1: "",
                    address2: "",
                    city: "",
                    state: "",
                    postalCode: "",
                    landmark: "",
                  });
                }}
                className="px-4 py-2 border rounded"
              >
                Reset
              </button>
            </div>

            {/* Payment */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <label className="flex items-center gap-2">
                <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
                Cash on Delivery
              </label>
            </div>

            {error && <div className="text-red-600 mt-4">{error}</div>}

            <div className="mt-6 flex gap-3">
              <button
                disabled={placingOrder}
                onClick={placeOrder}
                className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg hover:bg-[#672828]"
              >
                {placingOrder ? "Placing order..." : "Place Order"}
              </button>
              <button onClick={() => navigate("/cart")} className="px-6 py-3 border rounded-lg">
                Back to cart
              </button>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <aside className="lg:col-span-4 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              {checkoutData.cartItems.map((item) => (
                <div key={item.id || item._id} className="flex items-center gap-3">
                  <img src={(item.images?.[0]) || item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.qty || 1}</div>
                  </div>
                  <div className="font-semibold">₹{(item.price * (item.qty || 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="text-sm text-gray-700">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>₹{totals.itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Discount</span>
                <span className="text-green-600">-₹{totals.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}</span>
              </div>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Delivery by <strong>{estimatedDelivery}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}