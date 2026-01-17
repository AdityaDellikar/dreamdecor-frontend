import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/apiClient";

import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";
import SimilarProducts from "./SimilarProducts";

/* ------------------- SKELETON LOADERS ------------------- */
const ImagesSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="w-full h-[400px] bg-gray-300 rounded-xl"></div>
    <div className="grid grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 bg-gray-300 rounded-md"></div>
      ))}
    </div>
  </div>
);

const InfoSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
    <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
    <div className="h-10 w-full bg-gray-300 rounded"></div>
    <div className="h-40 w-full bg-gray-300 rounded"></div>
  </div>
);

/* ------------------- PRODUCT PAGE ------------------- */
export default function ProductPage() {
  const { id } = useParams(); // MongoDB _id
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to load product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ------------------- NOT FOUND ------------------- */
  if (!loading && !product) {
    return (
      <div className="min-h-screen bg-[var(--cream)] pt-28 pb-20">
        <div className="container mx-auto px-6 text-center text-gray-700">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <p className="mt-2">The product you’re looking for does not exist.</p>
        </div>
      </div>
    );
  }

  /* ------------------- LOADING ------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] pt-28 pb-20">
        <div className="container mx-auto px-6 space-y-16">
          <div className="grid md:grid-cols-2 gap-10">
            <ImagesSkeleton />
            <InfoSkeleton />
          </div>

          <div className="animate-pulse h-10 w-1/3 bg-gray-300 rounded"></div>
          <div className="animate-pulse h-40 w-full bg-gray-300 rounded"></div>

          <div className="animate-pulse h-10 w-1/4 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ------------------- PRODUCT CONTENT ------------------- */
  return (
    <div className="min-h-screen bg-[var(--cream)] pt-28 pb-20">
      <div className="container mx-auto px-6 space-y-20">
        {/* Images + Info */}
        <div className="grid md:grid-cols-2 gap-10">
          <ProductImages images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>

        {/* Reviews */}
        <ProductReviews reviews={product.reviews ?? []} />

        {/* Similar Products */}
        <SimilarProducts similarIds={product.similarIds ?? []} />
      </div>
    </div>
  );
}