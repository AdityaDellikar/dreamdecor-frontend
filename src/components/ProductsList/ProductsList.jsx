import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api/apiClient";
import { toggleFavourite, isFavourite } from "../../utils/favourites";

/* Skeleton loader */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-gray-300" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function ProductsList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");

  // Filter UI state
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOrder, setSortOrder] = useState(null); // "low-high" | "high-low"

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        const list = res.data.products ?? res.data ?? [];
        if (mounted) setProducts(list);
      } catch (e) {
        console.error("Failed to load products", e);
        setErr("Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  /* ------------------------------
     FILTER + SORT LOGIC
  -------------------------------*/
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const price = Number(p.price) || 0;

      // Price filtering
      if (price < priceRange[0] || price > priceRange[1]) return false;

      return true;
    });

    // Sorting
    if (sortOrder === "low-high") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortOrder === "high-low") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return list;
  }, [products, priceRange, sortOrder]);

  return (
    <div className="min-h-screen bg-[var(--cream)] pt-24 pb-16">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 mb-6">

          {/* Title + Mobile Filter Button */}
          <div className="flex items-center justify-between md:justify-start md:gap-8">
            <h1 className="text-xl font-semibold text-gray-900">
              All Products ({filteredProducts.length})
            </h1>

            {/* Mobile filter trigger */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 md:hidden"
            >
              Filter & Sort
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          {/* DESKTOP FILTER BAR */}
          <div className="hidden md:flex items-center gap-10 bg-white p-4 rounded-xl shadow-sm">

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Price</span>

              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-40 accent-black"
              />

              <span className="text-sm text-gray-600">
                ₹{priceRange[0]} – ₹{priceRange[1]}
              </span>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm font-medium text-gray-700">Sort</span>

              <select
                value={sortOrder ?? ""}
                onChange={(e) =>
                  setSortOrder(e.target.value || null)
                }
                className="border rounded-md px-3 py-1 text-sm"
              >
                <option value="">Default</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {err && <div className="text-red-600 mb-4">{err}</div>}

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const id = product._id ?? product.id;
              const firstImage =
                product.images?.[0]?.url ??
                product.images?.[0]?.secure_url ??
                product.images?.[0];

              return (
                <Link
                  key={id}
                  to={`/product/${id}`}
                  className="relative bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Favourite */}
                  <button
                    className="absolute top-3 right-3 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavourite(id);
                      setProducts([...products]);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isFavourite(id) ? "red" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={isFavourite(id) ? "red" : "gray"}
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.622 
                        1.126-4.312 2.733-.69-1.607-2.377-2.733-4.313-2.733C4.1 
                        3.75 2 5.765 2 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </button>

                  <img
                    src={firstImage}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />

                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700">₹{product.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* -------------------------
          FILTER DRAWER
      -------------------------- */}
      {showFilters && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[80%] bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Filter & Sort</h2>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            {/* Price Filter */}
            <div className="mt-8">
              <h3 className="font-medium mb-4">Price Range</h3>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>

              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full accent-black"
              />
            </div>

            {/* Sort */}
            <div className="mt-8">
              <h3 className="font-medium mb-3">Sort by Price</h3>

              <label className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="sort"
                  checked={sortOrder === "low-high"}
                  onChange={() => setSortOrder("low-high")}
                />
                Low to High
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sort"
                  checked={sortOrder === "high-low"}
                  onChange={() => setSortOrder("high-low")}
                />
                High to Low
              </label>
            </div>

            <button
              onClick={() => {
                setPriceRange([0, 50000]);
                setSortOrder(null);
              }}
              className="mt-8 w-full py-3 text-sm font-medium border rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}