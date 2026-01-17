// src/components/admin/AdminAddProduct.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import adminApi from "../../api/adminApi";
import api from "../../api/apiClient";
import toast from "react-hot-toast";

export default function AdminAddProduct() {
  const CLOUD_NAME = "dmub92qz1";
  const UPLOAD_PRESET = "products_unsigned";

  const [allProducts, setAllProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    rating: 4.5,
    similarIds: [],
    specs: {
      material: "",
      color: "",
      weight: "",
      dimensions: { width: "", height: "", unit: "inch" },
    },
    reviews: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------------------
     LOAD ALL PRODUCTS FOR SIMILARIDS SELECT 
  ---------------------------------------------------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get("/products");
        setAllProducts(res.data.products || []);
      } catch {
        console.error("Failed to load product list");
      }
    };
    loadProducts();
  }, []);

  /* ----------------------------------------------------
     HANDLERS
  ---------------------------------------------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSpecsChange = (e) =>
    setForm({
      ...form,
      specs: { ...form.specs, [e.target.name]: e.target.value },
    });

  const handleDimensionsChange = (e) =>
    setForm({
      ...form,
      specs: {
        ...form.specs,
        dimensions: {
          ...form.specs.dimensions,
          [e.target.name]: e.target.value,
        },
      },
    });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const addReview = () => {
    setForm({
      ...form,
      reviews: [...form.reviews, { name: "", comment: "", rating: 5 }],
    });
  };

  const updateReview = (index, field, value) => {
    const updated = [...form.reviews];
    updated[index][field] = value;
    setForm({ ...form, reviews: updated });
  };

  const deleteReview = (index) => {
    setForm({
      ...form,
      reviews: form.reviews.filter((_, i) => i !== index),
    });
  };

  /* ----------------------------------------------------
     SUBMIT
  ---------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImages = [];

      // Upload to Cloudinary
      for (let img of newImages) {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        );
        const result = await res.json();

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        rating: Number(form.rating),

        // Convert selected options into array of MongoDB ObjectId strings
        similarIds: form.similarIds,

        specs: {
          material: form.specs.material,
          color: form.specs.color,
          weight: form.specs.weight,
          dimensions: {
            width: Number(form.specs.dimensions.width),
            height: Number(form.specs.dimensions.height),
            unit: form.specs.dimensions.unit,
          },
        },

        reviews: form.reviews.map((r) => ({
          name: r.name,
          comment: r.comment,
          rating: Number(r.rating),
        })),

        images: uploadedImages,
      };

      await adminApi.createProduct(payload);
      toast.success("Product created!");

      window.location.href = "/admin/products";
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
     UI
  ---------------------------------------------------- */
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-lg space-y-6"
      >
        {/* Basic Fields */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Product Name"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Description"
          rows={3}
          required
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Price"
          required
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Category"
          required
        />

        <input
          type="number"
          name="stock"
          value={form.stock}
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
          value={form.rating}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          placeholder="Rating 1–5"
        />

        {/* Specifications */}
        <h3 className="font-semibold">Specifications</h3>

        <input
          name="material"
          value={form.specs.material}
          onChange={handleSpecsChange}
          className="w-full p-3 border rounded"
          placeholder="Material"
        />

        <input
          name="color"
          value={form.specs.color}
          onChange={handleSpecsChange}
          className="w-full p-3 border rounded"
          placeholder="Color"
        />

        <input
          name="weight"
          value={form.specs.weight}
          onChange={handleSpecsChange}
          className="w-full p-3 border rounded"
          placeholder="Weight"
        />

        {/* Dimensions */}
        <div className="flex gap-4">
          <input
            name="width"
            type="number"
            value={form.specs.dimensions.width}
            onChange={handleDimensionsChange}
            className="w-full p-3 border rounded"
            placeholder="Width"
          />

          <input
            name="height"
            type="number"
            value={form.specs.dimensions.height}
            onChange={handleDimensionsChange}
            className="w-full p-3 border rounded"
            placeholder="Height"
          />

          <select
            name="unit"
            value={form.specs.dimensions.unit}
            onChange={handleDimensionsChange}
            className="p-3 border rounded"
          >
            <option value="inch">Inch</option>
            <option value="cm">CM</option>
            <option value="ft">Feet</option>
          </select>
        </div>

        {/* Similar Products Selector (MULTI-SELECT) */}
        <div>
          <h3 className="font-semibold">Similar Products</h3>
          <select
            multiple
            className="w-full p-3 border rounded h-40"
            value={form.similarIds}
            onChange={(e) =>
              setForm({
                ...form,
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
        </div>

        {/* Reviews */}
        <h3 className="font-semibold">Customer Reviews</h3>

        {form.reviews.map((r, index) => (
          <div key={index} className="border rounded p-4 space-y-2 bg-gray-50">
            <input
              value={r.name}
              onChange={(e) => updateReview(index, "name", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Reviewer Name"
            />

            <textarea
              value={r.comment}
              onChange={(e) => updateReview(index, "comment", e.target.value)}
              className="w-full p-2 border rounded"
              rows={2}
              placeholder="Comment"
            />

            <input
              type="number"
              min="1"
              max="5"
              step="1"
              value={r.rating}
              onChange={(e) => updateReview(index, "rating", e.target.value)}
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

        {/* Image Upload */}
        <div>
          <label className="font-semibold">Upload Images</label>
          <input type="file" multiple onChange={handleImageUpload} />

          <div className="flex gap-4 mt-3">
            {preview.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-24 h-24 object-cover rounded"
                alt=""
              />
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </AdminLayout>
  );
}