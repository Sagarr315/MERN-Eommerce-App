import React, { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Define logout first using useCallback
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (token && !user) {
      axiosInstance.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => logout());
    }
  }, [token, user, logout]);

  // ✅ ADD THIS NEW USEEFFECT TO HANDLE BROWSER BACK BUTTON
  useEffect(() => {
    const handlePopState = () => {
      // Re-check authentication when browser back/forward is pressed
      if (token) {
        axiosInstance.get("/auth/verify")
          .then(res => {
            // Token is still valid, keep user logged in
            if (!user) {
              setUser(res.data.user);
            }
          })
          .catch(() => {
            // Token expired, logout
            logout();
          });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [token, user, logout]);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
    // ✅ Replace history so back button doesn't go to login page
    window.history.replaceState(null, '', '/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};