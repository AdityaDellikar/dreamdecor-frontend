// src/api/adminApi.js
import api from "./apiClient"; // baseURL: http://localhost:5001/api

const adminApi = {
  /* --------------------------- USERS --------------------------- */
  getUsers: () => api.get("/admin/users"),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  /* -------------------------- PRODUCTS ------------------------- */
  getProducts: () => api.get("/admin/products"),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => api.post("/admin/products", data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  /* --------------------------- IMAGES --------------------------- */
  deleteImage: (public_id) => api.delete(`/upload/${public_id}`),

  /* --------------------------- ORDERS --------------------------- */
  // list all orders (admin)
  getOrders: () => api.get("/admin/orders"),

  // get single order details (admin)
  getOrder: (id) => api.get(`/admin/orders/${id}`),

  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }),

  // admin adds tracking event (matches your backend!)
  addTracking: (id, data) => api.post(`/orders/${id}/track`, data),

  /* -------------------------- PINCODES -------------------------- */
  // list pincodes (with pagination)
  getPincodes: ({ page = 1, limit = 20, search = "", state = "" } = {}) =>
    api.get("/admin/pincodes", { params: { page, limit, search, state } }),

  // create new pincode
  createPincode: (data) => api.post("/admin/pincodes", data),

  // upload CSV of pincodes
  uploadPincodesCSV: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post("/admin/pincodes/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // bulk update
  bulkUpdatePincodes: (payload) =>
    api.put("/admin/pincodes/bulk", payload),

  // update single pincode
  updatePincode: (pincode, data) =>
    api.put(`/admin/pincodes/${pincode}`, data),

  //cancellation
  handleCancellationAdmin: (id, data) => api.put(`/orders/${id}/cancel/handle`, data),
};

export default adminApi;