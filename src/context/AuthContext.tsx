import React, { createContext, useContext, useState } from "react";
import { speakGreeting } from "../services/greetingService";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  const login = (name: string) => {
    setIsLoggedIn(true);
    sessionStorage.setItem("token", "dummy-token");

    // 🔊 Speak greeting after login
    speakGreeting(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("token");
    window.speechSynthesis.cancel();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};