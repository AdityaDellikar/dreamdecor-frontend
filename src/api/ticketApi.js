import api from "./apiClient";

const ticketApi = {
  createTicket: (data) => api.post("/tickets", data),
  getAllTickets: () => api.get("/tickets"),
  updateTicket: (id, data) => api.put(`/tickets/${id}`, data),
};

export default ticketApi;