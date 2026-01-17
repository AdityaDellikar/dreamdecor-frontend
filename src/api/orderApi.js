import api from "./apiClient";

const orderApi = {
  createOrder: (payload) => api.post("/orders", payload),
  getMyOrders: () => api.get("/orders/my-orders"),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, data) => api.post(`/orders/${id}/cancel`, data),
  // admin
  handleCancellationAdmin: (id, data) => api.put(`/orders/${id}/cancel/handle`, data),
};

export default orderApi;