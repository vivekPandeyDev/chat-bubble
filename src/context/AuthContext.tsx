import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (token: string, username: string, expiresAt: number) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    const expiresAt = Number(localStorage.getItem("expiresAt"));

    if (storedToken && storedUsername && expiresAt > Date.now() / 1000) {
      setToken(storedToken);
      setUsername(storedUsername);
    } else {
      localStorage.clear();
    }
  }, []);

  const login = (token: string, username: string, expiresAt: number) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("username", username);
    localStorage.setItem("expiresAt", expiresAt.toString());
    setToken(token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
