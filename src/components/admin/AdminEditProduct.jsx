// src/components/admin/AdminEditProduct.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import adminApi from "../../api/adminApi";
import api from "../../api/apiClient";
import toast from "react-hot-toast";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const CLOUD_NAME = "dmub92qz1";
  const UPLOAD_PRESET = "products_unsigned";

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  const [allProducts, setAllProducts] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  /* ----------------------------------------------------
     LOAD PRODUCT + ALL PRODUCTS FOR SIMILAR IDS
  ---------------------------------------------------- */
  const loadProduct = useCallback(async () => {
    try {
      const res = await adminApi.getProduct(id);
      setProduct(res.data.product);
    } catch (err) {
      console.error("Load product failed:", err);
      toast.error("Failed to load product");
      navigate("/admin/products");
    }
  }, [id, navigate]);

  const loadAllProducts = async () => {
    try {
      const res = await api.get("/products");
      setAllProducts(res.data.products || []);
    } catch {
      console.error("Failed to load product list");
    }
  };

  useEffect(() => {
    loadProduct();
    loadAllProducts();
  }, [loadProduct]);

  /* ----------------------------------------------------
     HANDLERS
  ---------------------------------------------------- */
  const handleChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSpecsChange = (e) =>
    setProduct({
      ...product,
      specs: { ...product.specs, [e.target.name]: e.target.value },
    });

  const handleDimensionsChange = (e) =>
    setProduct({
      ...product,
      specs: {
        ...product.specs,
        dimensions: {
          ...product.specs.dimensions,
          [e.target.name]: e.target.value,
        },
      },
    });

  const handleReviewChange = (index, field, value) => {
    const updated = [...product.reviews];
    updated[index][field] = value;
    setProduct({ ...product, reviews: updated });
  };

  const addReview = () =>
    setProduct({
      ...product,
      reviews: [...product.reviews, { name: "", comment: "", rating: 5 }],
    });

  const deleteReview = (index) =>
    setProduct({
      ...product,
      reviews: product.reviews.filter((_, i) => i !== index),
    });

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const deleteExistingImage = async (public_id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await adminApi.delete(`/products/image/${public_id}`);

      setProduct({
        ...product,
        images: product.images.filter((img) => img.public_id !== public_id),
      });

      toast.success("Image removed");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  /* ----------------------------------------------------
     SUBMIT
  ---------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedImages = [...product.images];

      // Upload any new images
      for (let img of newImages) {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        );

        const result = await res.json();

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      const payload = {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        stock: Number(product.stock ?? 0),
        rating: Number(product.rating ?? 0),

        similarIds: product.similarIds, // now ObjectId array

        specs: {
          material: product.specs.material,
          color: product.specs.color,
          weight: product.specs.weight,
          dimensions: {
            width: Number(product.specs.dimensions.width),
            height: Number(product.specs.dimensions.height),
            unit: product.specs.dimensions.unit,
          },
        },

        reviews: product.reviews.map((r) => ({
          name: r.name,
          comment: r.comment,
          rating: Number(r.rating),
        })),

        images: updatedImages,
      };

      await adminApi.updateProduct(id, payload);

      toast.success("Product updated");

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
     LOADING STATE
  ---------------------------------------------------- */
  if (!product)
    return (
      <AdminLayout>
        <p>Loading product...</p>
      </AdminLayout>
    );

  /* ----------------------------------------------------
     UI
  ---------------------------------------------------- */
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-lg space-y-6"
      >
        {/* BASIC FIELDS */}
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Product Name"
        />

        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 border rounded"
          placeholder="Description"
        />

        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Price"
        />

        <input
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Category"
        />

        <input
          name="stock"
          value={product.stock}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Stock"
        />

        <input
          name="rating"
          type="number"
          step="0.1"
          min="1"
          max="5"
          value={product.rating}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Rating (1–5)"
        />

        {/* SPECS */}
        <h2 className="font-semibold mt-4">Specifications</h2>

        <input
          name="material"
          value={product.specs.material}
          onChange={handleSpecsChange}
          className="w-full p-3 border rounded"
          placeholder="Material"
        />

        <input
          name="color"
          value={product.specs.color}
          onChange={handleSpecsChange}
          className="w-full p-3 border rounded"
          placeholder="Color"
        />

        <input
          name="weight"
          value={product.specs.weight}
          onChange={handleSpecsChange}
          className="w-full p-3 border rounded"
          placeholder="Weight (e.g. 1.2kg)"
        />

        {/* DIMENSIONS */}
        <div className="flex gap-4">
          <input
            name="width"
            type="number"
            value={product.specs.dimensions.width}
            onChange={handleDimensionsChange}
            className="w-full p-3 border rounded"
            placeholder="Width"
          />

          <input
            name="height"
            type="number"
            value={product.specs.dimensions.height}
            onChange={handleDimensionsChange}
            className="w-full p-3 border rounded"
            placeholder="Height"
          />

          <select
            name="unit"
            value={product.specs.dimensions.unit}
            onChange={handleDimensionsChange}
            className="p-3 border rounded"
          >
            <option value="inch">Inch</option>
            <option value="cm">CM</option>
            <option value="ft">Feet</option>
          </select>
        </div>

        {/* SIMILAR PRODUCTS SELECT */}
        <h2 className="font-semibold">Similar Products</h2>
        <select
          multiple
          className="w-full p-3 border rounded h-40"
          value={product.similarIds}
          onChange={(e) =>
            setProduct({
              ...product,
              similarIds: Array.from(e.target.selectedOptions).map(
                (o) => o.value
              ),
            })
          }
        >
          {allProducts.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* REVIEWS */}
        <h2 className="font-semibold">Customer Reviews</h2>

        {product.reviews.map((review, index) => (
          <div key={index} className="border rounded p-4 space-y-2 bg-gray-50">
            <input
              value={review.name}
              onChange={(e) =>
                handleReviewChange(index, "name", e.target.value)
              }
              className="w-full p-2 border rounded"
              placeholder="Reviewer Name"
            />

            <textarea
              value={review.comment}
              onChange={(e) =>
                handleReviewChange(index, "comment", e.target.value)
              }
              rows={2}
              className="w-full p-2 border rounded"
              placeholder="Comment"
            />

            <input
              type="number"
              min="1"
              max="5"
              value={review.rating}
              onChange={(e) =>
                handleReviewChange(index, "rating", e.target.value)
              }
              className="w-full p-2 border rounded"
              placeholder="Rating"
            />

            <button
              type="button"
              onClick={() => deleteReview(index)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addReview}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Add Review
        </button>

        {/* EXISTING IMAGES */}
        <h3 className="font-semibold mt-6">Existing Images</h3>
        <div className="flex gap-4 flex-wrap">
          {product.images.map((img) => (
            <div key={img.public_id} className="relative">
              <img
                src={img.url}
                className="w-24 h-24 object-cover rounded"
                alt=""
              />

              <button
                type="button"
                onClick={() => deleteExistingImage(img.public_id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* NEW IMAGE UPLOAD */}
        <div>
          <label className="font-semibold">Upload New Images</label>
          <input type="file" multiple onChange={handleNewImages} />

          <div className="flex gap-3 mt-3">
            {newPreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </AdminLayout>
  );
}