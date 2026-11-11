import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await api.getProfile();
      if (u.role !== "admin") {
        setToken(null);
        setUser(null);
      } else {
        setUser(u);
      }
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const token = res.token || res.data?.token;
    if (!token) throw new Error("No token returned");
    setToken(token);
    const u = res.user || (await api.getProfile());
    if (!u || u.role !== "admin") {
      setToken(null);
      throw new Error("This account does not have admin access.");
    }
    setUser(u);
    return u;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, reload: load }}>
      {children}
    </AuthContext.Provider>
  );
};
