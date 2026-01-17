// src/pages/OrderSuccess.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="min-h-[100svh] bg-[var(--cream)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
          ✓
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Order placed successfully
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          Thank you for shopping with us.  
          Your order is being prepared and you’ll be able to track every step.
        </p>

        {/* Primary CTA */}
        <Link
          to={`/order/${id}/tracking`}
          className="
            mt-6 inline-flex w-full items-center justify-center
            rounded-full bg-[var(--brand)] px-6 py-3
            text-white text-sm font-medium
            transition hover:opacity-90
          "
        >
          Track your order
        </Link>

        {/* Secondary CTA */}
        <Link
          to="/orders"
          className="mt-4 block text-xs text-gray-500 hover:text-gray-700"
        >
          View all orders
        </Link>
      </div>
    </div>
  );
}