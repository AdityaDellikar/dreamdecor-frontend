import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";
import api from "../../api/apiClient";

import {
  toggleFavourite,
  isFavourite,
} from "../../utils/favourites";

export default function SimilarProducts({ similarIds = [] }) {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilar = async () => {
      try {
        const res = await api.get("/products");
        const all = res.data.products || [];

        let filtered = [];

        if (Array.isArray(similarIds) && similarIds.length > 0) {
          filtered = all.filter((p) => similarIds.includes(p._id));
        }

        const finalList =
          filtered.length > 0
            ? filtered.slice(0, 4)
            : all.sort(() => 0.5 - Math.random()).slice(0, 4);

        setSimilarProducts(finalList);
      } catch (err) {
        console.error("Failed loading similar products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSimilar();
  }, [similarIds]);

  if (loading) return <p className="text-gray-500">Loading similar products…</p>;
  if (!similarProducts.length) return null;

  const getImageUrl = (img) =>
    typeof img === "string" ? img : img?.url || "";

  return (
    <div className="mt-14 md:mt-20 px-2 md:px-0">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-5 md:mb-8">
        You Might Also Like
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {similarProducts.map((product) => (
          <motion.div
            key={product._id}
            className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                className="w-full h-40 md:h-56 object-cover"
              />
            </Link>

            {/* ❤️ Favourite button */}
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => {
                e.preventDefault();
                toggleFavourite(product._id);
                setSimilarProducts([...similarProducts]); // re-render
              }}
              className="absolute top-3 right-3 cursor-pointer"
            >
              <AiFillHeart
                size={24}
                className={isFavourite(product._id) ? "text-red-500" : "text-gray-300"}
              />
            </motion.div>

            <div className="p-3 md:p-4">
              <h3 className="font-medium text-sm md:text-lg text-gray-800 mb-1 leading-snug">
                {product.name}
              </h3>
              <p className="text-gray-700 font-medium mb-2 text-sm md:text-base">
                ₹{product.price}
              </p>

              <Link
                to={`/product/${product._id}`}
                className="hidden md:inline-block text-sm px-4 py-2 bg-[var(--brand)] text-white rounded-md hover:bg-[#672828] transition"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}