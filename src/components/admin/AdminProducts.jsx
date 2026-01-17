import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProducts(); 
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error("loadProducts:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    const ok = window.confirm(`Delete "${product.name}"? This will remove the product and its images from Cloudinary.`);
    if (!ok) return;

    setDeletingId(product._id);
    try {
      // DELETE should handle Cloudinary image deletes server-side
      await adminApi.deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success("Product deleted");
    } catch (err) {
      console.error("deleteProduct:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-[var(--brand)] text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading products…</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-4">Preview</th>
                <th className="p-4">Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="p-4 w-28">
                    {/** product.images may be array of { url, public_id } or just strings.
                         handling both shapes. */}
                    <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      {p.images && p.images.length > 0 ? (
                        // handle object or string
                        typeof p.images[0] === "string" ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <img src={p.images[0].url || p.images[0].secure_url} alt={p.name} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="text-xs text-gray-400">No image</div>
                      )}
                    </div>
                  </td>

                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4">{p.stock ?? "-"}</td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                      className="text-sm px-3 py-1 mr-2 bg-yellow-50 border rounded hover:bg-yellow-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deletingId === p._id}
                      className="text-sm px-3 py-1 bg-red-50 border rounded hover:bg-red-100"
                    >
                      {deletingId === p._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-600">
                    No products yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}