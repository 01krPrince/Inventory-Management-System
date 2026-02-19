import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UnsavedChangesProvider } from "./hooks/useUnsavedChangesWarning";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import LandingPage from "./layout/landingPage";
import DemoPopup from "./components/DemoPopUp";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const initialTimeout = setTimeout(() => {
      setShowPopup(true);
    }, 60000);

    const interval = setInterval(() => {
      setShowPopup(true);
    }, 100000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  return (
    <>
      {/* Injected CSS Animation */}
      <style>
        {`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fadeInScale {
            animation: fadeInScale 0.2s ease-out;
          }
        `}
      </style>

      <Router>
        <ScrollToTop />
        <Toaster />

        {isLoggedIn && (
          <DemoPopup
            show={showPopup}
            onClose={() => setShowPopup(false)}
          />
        )}

        <Routes>
          {isLoggedIn ? (
            <Route path="/*" element={<AppLayout />} />
          ) : (
            <Route path="/*" element={<LandingPage />} />
          )}
        </Routes>
      </Router>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <UnsavedChangesProvider>
        <AppRoutes />
      </UnsavedChangesProvider>
    </AuthProvider>
  );
}
