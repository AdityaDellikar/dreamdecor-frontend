import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../api/apiClient";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/products");
        const list = res.data.products || [];

        // Pick first 4 as featured
        setProducts(list.slice(0, 4));
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return <p className="text-gray-600 text-center">Loading Featured Products…</p>;

  if (!products.length)
    return <p className="text-gray-600 text-center">No products available.</p>;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      className="mt-24 md:mt-32"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 px-1">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Featured Products
        </h2>
        <Link
          to="/products"
          className="text-[var(--brand)] text-sm font-semibold underline-offset-2 hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Grid */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          md:gap-8
        "
      >
        {products.map((p, index) => {
          const id = p._id || p.id;

          const firstImage =
            typeof p.images?.[0] === "string"
              ? p.images[0]
              : p.images?.[0]?.url || p.images?.[0]?.secure_url;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              className="
                bg-white
                rounded-xl
                shadow-sm
                overflow-hidden
                hover:shadow-md
                transition
              "
            >
              <Link to={`/product/${id}`}>
                <img
                  src={firstImage}
                  alt={p.name}
                  className="w-full h-36 sm:h-44 md:h-48 object-cover"
                />
              </Link>

              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                  {p.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3">₹{p.price}</p>

                <Link
                  to={`/product/${id}`}
                  className="
                    block
                    text-center
                    text-sm
                    px-3 py-2
                    rounded-md
                    bg-[var(--brand)]
                    text-white
                    hover:bg-[#672828]
                    transition
                  "
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}