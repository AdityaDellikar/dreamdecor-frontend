// src/components/pages/Cart.jsx
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

// --------------------------------------------------------
// SKELETONS (Amazon-style shimmer loaders)
// --------------------------------------------------------
const CartSkeleton = () => (
  <div className="animate-pulse grid lg:grid-cols-3 gap-10 pt-24 pb-16">
    {/* Left side (items) */}
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="h-8 w-48 bg-gray-300 rounded"></div>

      {[1, 2].map((i) => (
        <div key={i} className="flex justify-between items-center border-b py-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-300 rounded-md"></div>
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-300 rounded"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      ))}

      {/* coupon skeleton */}
      <div className="space-y-2 mt-4">
        <div className="h-5 w-32 bg-gray-300 rounded"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* address skeleton */}
      <div className="space-y-2 mt-6">
        <div className="h-5 w-40 bg-gray-300 rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>

    {/* Summary skeleton */}
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4 h-fit">
      <div className="h-6 bg-gray-300 w-40 rounded"></div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
      ))}

      <hr />

      <div className="flex justify-between">
        <div className="h-5 w-20 bg-gray-300 rounded"></div>
        <div className="h-5 w-16 bg-gray-300 rounded"></div>
      </div>

      <div className="h-12 bg-gray-300 rounded mt-6"></div>
    </div>
  </div>
);

export default function Cart() {
  const navigate = useNavigate();

  // Cart context: provides persisted cart state & helpers
  const { cartItems, removeFromCart, updateQty, totals, clearCart } = useCart();

  // Local state for simple UI interactions
  const [coupon, setCoupon] = useState("");
  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    pincode: "",
    city: "",
  });

  // Simple loading flag if you want to show skeleton (context is synchronous)
  const [loading] = useState(false);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const itemsSubtotal = totals?.itemsSubtotal ?? 0;
  const discount = 0;
  const shipping = itemsSubtotal >= 999 ? 0 : 49;
  const total = Math.round((itemsSubtotal - discount + shipping) * 100) / 100;

  const handleProceedToCheckout = () => {
    if (!address.name || !address.mobile || !address.city) {
      toast.error("Please fill basic delivery details first");
      return;
    }

    const checkoutData = {
      cartItems,
      address,
      totals: { itemsSubtotal, discount, shipping, total },
    };

    localStorage.setItem("checkout_cart", JSON.stringify(checkoutData));

    toast.success("Proceeding to checkout…");
    navigate("/checkout");
  };

  const getFirstImage = (item) => {
    if (!item) return "";
    if (Array.isArray(item.images) && item.images.length > 0) {
      return typeof item.images[0] === "string" ? item.images[0] : item.images[0]?.url || "";
    }
    // fallback for legacy 'image' prop
    return item.image || "";
  };

  if (loading) return <CartSkeleton />;

  return (
    <div className="min-h-screen bg-[var(--cream)] pt-24 pb-16 px-6">
      <div className="container mx-auto grid lg:grid-cols-3 gap-10">
        
        {/* CART ITEMS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>

          {!cartItems || cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => {
              const keyId = item._id ?? item.id;
              return (
                <div
                  key={keyId}
                  className="border-b py-4 flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center"
                >
                  <div className="flex gap-4">
                    <img
                      src={getFirstImage(item)}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price}</p>
                      {item.selectedSize?.label && (
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {item.selectedSize.label}
                        </p>
                      )}

                      {/* quantity controls */}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => updateQty(keyId, (item.qty || 1) - 1)}
                          className="px-2 py-1 border rounded"
                        >
                          -
                        </button>
                        <div className="px-3 py-1 border rounded">{item.qty || 1}</div>
                        <button
                          onClick={() => updateQty(keyId, (item.qty || 1) + 1)}
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4">
                    <button
                      onClick={() => handleRemove(keyId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={22} />
                    </button>
                    <div className="text-sm text-gray-600">₹{((item.price || 0) * (item.qty || 1)).toFixed(2)}</div>
                  </div>
                </div>
              );
            })
          )}

          {/* COUPON */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Apply Coupon
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="border px-4 py-2 rounded-md w-full focus:ring focus:ring-blue-200"
              />
              <button
                onClick={() => toast.success("Coupon applied (demo)")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Apply
              </button>
            </div>
          </div>

          {/* QUICK ADDRESS */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Delivery Address (Quick)
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full name"
                value={address.name}
                onChange={handleAddressChange}
                className="border px-4 py-2 rounded-md"
              />

              <input
                name="mobile"
                placeholder="Mobile number"
                value={address.mobile}
                onChange={handleAddressChange}
                className="border px-4 py-2 rounded-md"
              />

              <input
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                className="border px-4 py-2 rounded-md"
              />

              <input
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                className="border px-4 py-2 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="hidden lg:block bg-white rounded-xl shadow-md p-6 h-fit">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{itemsSubtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Discount</span>
            <span className="text-green-600">₹{discount}</span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Shipping Charges</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-semibold text-gray-800 text-lg mb-4">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full py-3 bg-[var(--brand)] text-white rounded-lg hover:bg-[#672828] transition font-semibold"
          >
            Proceed to Checkout
          </button>

          {/* Optional: Clear cart during testing */}
          <button
            onClick={() => {
              if (window.confirm("Clear cart?")) {
                clearCart();
                toast.success("Cart cleared");
              }
            }}
            className="hidden lg:block w-full mt-3 py-2 border rounded text-sm"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/*
        Mobile Sticky Checkout Bar
      */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden z-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-semibold">₹{total.toFixed(2)}</p>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg font-semibold"
          >
            Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}