import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user on refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await api.get("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);