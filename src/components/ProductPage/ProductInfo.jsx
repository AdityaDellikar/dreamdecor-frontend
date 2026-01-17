import React, { useState, useMemo, useCallback } from "react";
import { AiFillStar } from "react-icons/ai";
import indiaIcon from "../../assets/icons/india-emblem.png";
import DeliveryCheckBox from "./DeliveryCheckBox";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toggleFavourite, isFavourite } from "../../utils/favourites";

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [unit, setUnit] = useState("inch");
  const [favsRefresh, setFavsRefresh] = useState(false);

  // Sizes fallback (IMPORTANT)
  const sizes =
    product?.specs?.sizes?.length > 0
      ? product.specs.sizes
      : [
          {
            width: product?.specs?.dimensions?.width || 0,
            height: product?.specs?.dimensions?.height || 0,
            depth: 1,
          },
        ];

  const [selectedSize, setSelectedSize] = useState(sizes[0]);


const convert = useCallback(
  (value) => {
    if (!value) return 0;
    if (unit === "cm") return (value * 2.54).toFixed(1);
    if (unit === "ft") return (value / 12).toFixed(2);
    return value;
  },
  [unit]
);

  const formattedSize = useMemo(() => {
    return `${convert(selectedSize.width)}L x ${convert(
      selectedSize.height
    )}H x ${convert(selectedSize.depth)}W ${unit}`;
  }, [selectedSize, unit, convert]);

  const { name, price, specs = {}, rating = 0, description } = product;

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
        {name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <AiFillStar
              key={i}
              className={i < Math.floor(rating) ? "" : "text-gray-300"}
            />
          ))}
          <span className="ml-2 text-gray-600 text-sm">({rating}/5)</span>
        </div>
      </div>

      {/* SIZE + UNIT */}
      <div className="space-y-2">
        <p className="font-medium">Select Size</p>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Size Dropdown */}
          <select
            value={`${selectedSize.width}-${selectedSize.height}`}
            onChange={(e) => {
              const [w, h] = e.target.value.split("-");
              const found = sizes.find(
                (s) => String(s.width) === w && String(s.height) === h
              );
              if (found) setSelectedSize(found);
            }}
            className="border rounded-xl px-4 py-3 w-full md:w-64 bg-white shadow-sm"
          >
            {sizes.map((s, idx) => (
              <option key={idx} value={`${s.width}-${s.height}`}>
                {`${convert(s.width)}L x ${convert(s.height)}H x ${convert(
                  s.depth
                )}W ${unit}`}
              </option>
            ))}
          </select>

          {/* Unit Switch */}
          <div className="flex gap-3 text-sm bg-gray-50 rounded-xl px-3 py-2">
            {["inch", "cm", "ft"].map((u) => (
              <label key={u} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  checked={unit === u}
                  onChange={() => setUnit(u)}
                />
                {u === "inch" ? "Inches" : u.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Price */}
      <p className="text-3xl font-semibold text-gray-900 tracking-tight">
        ₹{price}
      </p>

      {/* CTA */}
      <div className="flex flex-wrap gap-3 items-center pt-2">
        {/* Favourite */}
        <button
          onClick={() => {
            toggleFavourite(product._id);
            setFavsRefresh(!favsRefresh);
          }}
          className="p-3 border rounded-xl hover:bg-gray-100 transition"
        >
          <svg
            fill={isFavourite(product._id) ? "red" : "none"}
            stroke={isFavourite(product._id) ? "red" : "gray"}
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            className="w-7 h-7"
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

        {/* Add to Cart */}
        <button
          onClick={() =>
            addToCart(
              {
                ...product,
                selectedSize: {
                  ...selectedSize,
                  unit,
                  label: formattedSize,
                },
              },
              1
            )
          }
          className="px-6 py-3 bg-[var(--brand)] text-white rounded-xl hover:opacity-90 transition"
        >
          Add to Cart
        </button>

        {/* Buy Now */}
        <button
          onClick={() => {
            addToCart(
              {
                ...product,
                selectedSize: {
                  ...selectedSize,
                  unit,
                  label: formattedSize,
                },
              },
              1
            );
            navigate("/cart");
          }}
          className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition"
        >
          Buy Now
        </button>
      </div>

      {/* Made in India */}
      <div className="flex items-center gap-2 mt-4 text-gray-700">
        <img src={indiaIcon} alt="India Emblem" className="w-6 h-6" />
        <p className="font-medium">Proudly Made in India</p>
      </div>

      <DeliveryCheckBox />

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Specs */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Specifications</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          {specs.material && <li><b>Material:</b> {specs.material}</li>}
          {specs.color && <li><b>Color:</b> {specs.color}</li>}
          <li><b>Selected Size:</b> {formattedSize}</li>
          {specs.weight && <li><b>Weight:</b> {specs.weight}</li>}
        </ul>
      </div>
    </div>
  );
}