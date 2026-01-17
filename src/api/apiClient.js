import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
});

// Only attach token if explicitly requested
export const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;