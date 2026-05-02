import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("dqmsToken"));

  useEffect(() => {
    const storedUser = localStorage.getItem("dqmsUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const saveSession = useCallback((data) => {
    localStorage.setItem("dqmsToken", data.token);
    localStorage.setItem("dqmsUser", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = async (email, password, expectedRole) => {
    const { data } = await api.post("/auth/login", { email, password, expectedRole });
    saveSession(data);
    return data.user;
  };

  const signup = async (form) => {
    const { data } = await api.post("/auth/signup", form);
    if (data.token && data.user) saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("dqmsToken");
    localStorage.removeItem("dqmsUser");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, saveSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
