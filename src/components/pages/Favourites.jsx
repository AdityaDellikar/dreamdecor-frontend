import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/apiClient";
import { getFavourites } from "../../utils/favourites";

export default function Favourites() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const favIds = getFavourites();

        if (favIds.length === 0) {
          setProducts([]);
          return;
        }

        const res = await api.get("/products");
        const all = res.data.products || [];

        const filtered = all.filter((p) => favIds.includes(p._id));
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load favourites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-28">
        Loading favourites…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] pt-28 pb-16 px-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Your Favourites ❤️</h1>

        {products.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">
              You haven’t added anything to favourites yet.
            </p>
            <Link
              to="/products"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <img
                  src={p.images?.[0]?.url || p.images?.[0]}
                  alt={p.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {p.name}
                  </h3>
                  <p className="text-gray-600">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}