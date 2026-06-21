// src/context/AuthContext.jsx
// ─────────────────────────────────────────────
// Authentication Context
//
// React Context lets us share state across ALL components
// without passing props through every level (prop drilling).
//
// This context stores:
//   - The current user object
//   - The JWT token
//   - login/logout/register functions
//
// Any component can call useAuth() to access this data.
// ─────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

// 1. Create the context object
const AuthContext = createContext(null);

// 2. Provider component that wraps our entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("taskflow_token"));
  const [loading, setLoading] = useState(true); // True while checking stored session

  // ─── Load stored session on app start ───────
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("taskflow_token");
      if (storedToken) {
        try {
          // Verify the token is still valid by fetching the profile
          const { data } = await authAPI.getProfile();
          setUser(data.user);
        } catch {
          // Token is invalid or expired — clear it
          localStorage.removeItem("taskflow_token");
          localStorage.removeItem("taskflow_user");
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // ─── Register ────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("taskflow_token", data.token);
    toast.success("Welcome to TaskFlow! 🎉");
    return data;
  }, []);

  // ─── Login ────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("taskflow_token", data.token);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data;
  }, []);

  // ─── Logout ───────────────────────────────────
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    toast.success("Logged out successfully");
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    register,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Custom hook for easy access
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
