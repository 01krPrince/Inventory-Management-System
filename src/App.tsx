import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UnsavedChangesProvider } from "./hooks/useUnsavedChangesWarning";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import LandingPage from "./layout/landingPage";

/* ✅ Routes separated so we can use AuthContext */
const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {isLoggedIn ? (
          <Route path="/*" element={<AppLayout />} />
        ) : (
          <Route path="/*" element={<LandingPage />} />
        )}
      </Routes>
    </Router>
  );
};

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Wake server
  const wakeServer = useCallback(async () => {
    try {
      await fetch("https://sports-hub-h2um.onrender.com/", {
        method: "GET",
        cache: "no-store",
      });
      console.log("Render server pinged:", new Date().toISOString());
    } catch (error) {
      console.error("Server ping failed:", error);
    }
  }, []);

  useEffect(() => {
    wakeServer();
    const intervalId = setInterval(wakeServer, 14 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [wakeServer]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsInitialized(true);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Waking up server...</div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <UnsavedChangesProvider>
        <AppRoutes />
      </UnsavedChangesProvider>
    </AuthProvider>
  );
}
