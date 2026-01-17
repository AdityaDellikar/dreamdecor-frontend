// src/helpers/cartUtils.js
export const CART_KEY = "dhana_cart_v1";

/**
 * getCart() -> returns array of cart items
 */
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("getCart parse error", err);
    return [];
  }
}

/**
 * setCart(items)
 */
export function setCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("setCart error", err);
  }
}

/**
 * addToCart(items) -> merges items by productId (increases qty if same)
 * items: [{ productId, name, price, qty, image }]
 */
export function addToCart(items = []) {
  const current = getCart();
  const map = new Map(current.map((i) => [String(i.productId), { ...i }]));
  items.forEach((it) => {
    const key = String(it.productId);
    if (map.has(key)) {
      map.get(key).qty = (map.get(key).qty || 1) + (it.qty || 1);
    } else {
      map.set(key, { ...it, qty: it.qty || 1 });
    }
  });
  const merged = Array.from(map.values());
  setCart(merged);
  return merged;
}