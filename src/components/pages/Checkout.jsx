// src/components/pages/Checkout.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/apiClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ADDRESS_BOOK_KEY = "address_book";
const CHECKOUT_CART_KEY = "checkout_cart";
const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

/* --------------------------------------------------
   DELIVERY DATE HELPER
---------------------------------------------------*/
function getEstimatedDelivery(daysFrom = 3, variability = 2) {
  const add = daysFrom + Math.floor(Math.random() * (variability + 1));
  const date = new Date();
  date.setDate(date.getDate() + add);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/* --------------------------------------------------
   LOAD RAZORPAY SDK
---------------------------------------------------*/
async function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState(null);
  const [addressBook, setAddressBook] = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(-1);
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

  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD | ONLINE
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  /* --------------------------------------------------
     LOAD CART AND ADDRESS BOOK
  ---------------------------------------------------*/
  useEffect(() => {
    const raw = localStorage.getItem(CHECKOUT_CART_KEY);
    if (!raw) {
      navigate("/cart");
      return;
    }

    try {
      setCheckoutData(JSON.parse(raw));
    } catch {
      navigate("/cart");
      return;
    }

    const savedAddresses = JSON.parse(
      localStorage.getItem(ADDRESS_BOOK_KEY) || "[]"
    );
    setAddressBook(savedAddresses);
    if (savedAddresses.length > 0) {
      setSelectedAddrIdx(0);
      setAddressDraft(savedAddresses[0]);
    }
  }, [navigate]);

  /* --------------------------------------------------
     TOTALS CALCULATION
  ---------------------------------------------------*/
  const totals = useMemo(() => {
    if (!checkoutData)
      return { itemsSubtotal: 0, discount: 0, shipping: 0, total: 0 };

    const itemsSubtotal =
      checkoutData.totals?.itemsSubtotal ??
      checkoutData.totals?.total ??
      checkoutData.totals?.totalPrice ??
      0;

    const discount = checkoutData.totals?.discount ?? 0;
    const shipping = itemsSubtotal >= 999 ? 0 : 49;
    const total = itemsSubtotal - discount + shipping;

    return { itemsSubtotal, discount, shipping, total };
  }, [checkoutData]);

  /* --------------------------------------------------
     ADDRESS AUTOSAVE
  ---------------------------------------------------*/
  useEffect(() => {
    if (selectedAddrIdx >= 0) {
      const updated = [...addressBook];
      updated[selectedAddrIdx] = addressDraft;
      setAddressBook(updated);
      localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(updated));
    }
    // eslint-disable-next-line
  }, [addressDraft, selectedAddrIdx]);

  const handleSelectAddress = (idx) => {
    setSelectedAddrIdx(idx);
    setAddressDraft(addressBook[idx]);
  };

  const handleAddressFieldChange = (e) => {
    const { name, value } = e.target;
    setAddressDraft((p) => ({ ...p, [name]: value }));
  };

  const handleSaveNewAddress = () => {
    const updated = [addressDraft, ...addressBook];
    setAddressBook(updated);
    localStorage.setItem(ADDRESS_BOOK_KEY, JSON.stringify(updated));
    setSelectedAddrIdx(0);
    toast.success("Address saved");
  };

  /* --------------------------------------------------
     RAZORPAY PAYMENT FLOW (order created AFTER payment)
  ---------------------------------------------------*/
  const startOnlinePayment = async (orderPayload) => {
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Razorpay SDK load failed");

      // 1️⃣ Create Razorpay order from backend
      const rp = await api.post("/orders/razorpay/create", {
        amount: orderPayload.totalPrice,
      });

      const { orderId, amount, key } = rp.data;

      // 2️⃣ Show Razorpay checkout
      const options = {
        key,
        amount,
        currency: "INR",
        name: "DreamDecor",
        description: "Online Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment AND create DB order
            const verify = await api.post("/orders/razorpay/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderPayload,
            });

            toast.success("Payment successful!");
            localStorage.removeItem(CHECKOUT_CART_KEY);

            navigate(`/order-success/${verify.data.order._id}`);
          } catch (e) {
            toast.error("Payment verification failed");
            console.error(e);
          }
        },
        prefill: {
          name: addressDraft.fullName,
          contact: addressDraft.phone,
        },
        theme: {
          color: "#b84a3d",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Try again.");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Unable to start online payment");
    }
  };

  /* --------------------------------------------------
     MAIN PLACE ORDER CLICK
  ---------------------------------------------------*/
  const placeOrder = async () => {
    setError("");

    if (
      !addressDraft.fullName ||
      !addressDraft.phone ||
      !addressDraft.address1 ||
      !addressDraft.city ||
      !addressDraft.postalCode
    ) {
      setError("Please fill all required shipping fields.");
      return;
    }

    const orderPayload = {
      items: checkoutData.cartItems.map((i) => ({
        productId: i.id || i._id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.images?.[0] || i.image,
      })),
      shippingAddress: { ...addressDraft },
      itemsPrice: totals.itemsSubtotal,
      shippingPrice: totals.shipping,
      taxPrice: 0,
      totalPrice: totals.total,
    };

    try {
      setPlacingOrder(true);

      // COD → Create order instantly
      if (paymentMethod === "COD") {
        const res = await api.post("/orders", {
          ...orderPayload,
          paymentMethod: "COD",
        });

        localStorage.removeItem(CHECKOUT_CART_KEY);
        toast.success("Order placed (COD)");
        navigate(`/order-success/${res.data.order._id}`);
        return;
      }

      // ONLINE → Razorpay first, backend order after verify
      await startOnlinePayment({ ...orderPayload, paymentMethod: "ONLINE" });
    } catch (err) {
      console.error("placeOrder:", err);
      toast.error("Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!checkoutData) return <div className="pt-28 text-center">Loading…</div>;

  const deliveryDate = getEstimatedDelivery();

  /* --------------------------------------------------
     JSX RETURN
  ---------------------------------------------------*/
  return (
    <div className="min-h-screen pt-20 pb-24 sm:pt-24 sm:pb-16 bg-[var(--cream)]">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              <p className="text-sm text-gray-600">
                Estimated delivery: <b>{deliveryDate}</b>
              </p>
            </div>

            {/* SAVED ADDRESSES */}
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {addressBook.length === 0 && (
                <p className="text-sm text-gray-500">No saved addresses.</p>
              )}

              {addressBook.map((addr, idx) => (
                <div
                  key={idx}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedAddrIdx === idx
                      ? "border-[var(--brand)] bg-rose-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelectAddress(idx)}
                >
                  <div className="font-medium">{addr.fullName}</div>
                  <div className="text-sm text-gray-600">
                    {addr.address1}, {addr.city} - {addr.postalCode}
                  </div>
                  <div className="text-sm text-gray-600">Phone: {addr.phone}</div>
                </div>
              ))}
            </div>

            {/* EDIT FORM */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="fullName"
                value={addressDraft.fullName}
                onChange={handleAddressFieldChange}
                placeholder="Full name *"
                className="border px-3 py-2 rounded"
              />
              <input
                name="phone"
                value={addressDraft.phone}
                onChange={handleAddressFieldChange}
                placeholder="Phone *"
                className="border px-3 py-2 rounded"
              />
              <input
                name="address1"
                value={addressDraft.address1}
                onChange={handleAddressFieldChange}
                placeholder="Address *"
                className="border px-3 py-2 rounded sm:col-span-2"
              />
              <input
                name="address2"
                value={addressDraft.address2}
                onChange={handleAddressFieldChange}
                placeholder="Address 2"
                className="border px-3 py-2 rounded"
              />
              <input
                name="city"
                value={addressDraft.city}
                onChange={handleAddressFieldChange}
                placeholder="City *"
                className="border px-3 py-2 rounded"
              />
              <input
                name="state"
                value={addressDraft.state}
                onChange={handleAddressFieldChange}
                placeholder="State *"
                className="border px-3 py-2 rounded"
              />
              <input
                name="postalCode"
                value={addressDraft.postalCode}
                onChange={handleAddressFieldChange}
                placeholder="Pincode *"
                className="border px-3 py-2 rounded"
              />
            </div>

            <button
              onClick={handleSaveNewAddress}
              className="mt-4 px-4 py-2 bg-[var(--brand)] text-white rounded"
            >
              Save Address
            </button>

            {/* PAYMENT METHOD */}
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>
              <label className="flex gap-2 items-center mt-2">
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                Online Payment (Razorpay)
              </label>
            </div>

            {error && <p className="text-red-600 mt-4">{error}</p>}

            <div className="fixed bottom-0 left-0 right-0 sm:static bg-white p-4 border-t sm:border-0">
              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="w-full sm:w-auto mt-2 sm:mt-6 px-6 py-3 bg-[var(--brand)] text-white rounded"
              >
                {placingOrder
                  ? "Processing..."
                  : paymentMethod === "COD"
                  ? "Place Order (COD)"
                  : "Pay Online"}
              </button>
            </div>
          </div>

          {/* RIGHT — SUMMARY */}
          <aside className="lg:col-span-4 bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {checkoutData.cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-3 mb-4">
                <img
                  src={item.image || item.images?.[0]}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                  alt=""
                />
                <div className="ml-3 flex-1">
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold">
                  ₹{(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}

            <hr className="my-3" />

            <p className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{totals.itemsSubtotal}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span>Discount</span>
              <span>-₹{totals.discount}</span>
            </p>
            <p className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}</span>
            </p>

            <hr className="my-3" />

            <p className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{totals.total}</span>
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}