// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const CART_KEY = "cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed reading cart from localStorage", err);
      return [];
    }
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed writing cart to localStorage", err);
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const id = product._id ?? product.id;
      const existing = prev.find((p) => (p._id ?? p.id) === id);
      if (existing) {
        return prev.map((p) =>
          (p._id ?? p.id) === id ? { ...p, qty: (p.qty || 1) + qty } : p
        );
      } else {
        const rawImage =
          product.images?.[0] || product.image || "";

        const primaryImage = rawImage.startsWith("http")
          ? rawImage
          : rawImage
          ? `${process.env.REACT_APP_API_URL}${rawImage}`
          : "";

        const cartItem = {
          _id: product._id ?? product.id,
          id: product._id ?? product.id,
          name: product.name,
          price: product.price,
          image: primaryImage,
          qty,
        };
        toast.success("Added to cart");
        return [cartItem, ...prev];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => (p._id ?? p.id) !== id));
    toast.success("Removed from cart");
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((p) => ((p._id ?? p.id) === id ? { ...p, qty } : p))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totals = cartItems.reduce(
    (acc, it) => {
      acc.itemsSubtotal += (it.price || 0) * (it.qty || 1);
      return acc;
    },
    { itemsSubtotal: 0 }
  );

  const values = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totals,
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};