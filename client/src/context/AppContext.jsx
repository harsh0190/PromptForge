import { createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

const AppContext = createContext();

export function AppContextProvider({ children }) {

  const navigate = useNavigate();

  //Auth States
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  //Auth Actions
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      setUser(data.user);
      toast.success("Account created successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  return (
    <AppContext.Provider value={{ user, loadingUser, login, register }}>
      {children}    
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}
