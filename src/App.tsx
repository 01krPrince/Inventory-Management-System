// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Ensure using react-router-dom if web
// import { UnsavedChangesProvider } from "./hooks/useUnsavedChangesWarning";

// import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
// // NotFound is removed from here because AppLayout handles missing tabs/pages internally now
// // or you can handle 404 inside AppLayout if the path doesn't match ComponentMap
// import AppLayout from "./layout/AppLayout";
// import { ScrollToTop } from "./components/common/ScrollToTop";

// export default function App() {
//   return (
//     <UnsavedChangesProvider>
//       <Router>
//         <ScrollToTop />
//         <Routes>
//           {/* --------------------------------------------------------- */}
//           {/* 1. Authentication Routes (Public)                         */}
//           {/* These must be defined BEFORE the wildcard route so        */}
//           {/* they take precedence.                                     */}
//           {/* --------------------------------------------------------- */}
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/signup" element={<SignUp />} />

//           {/* --------------------------------------------------------- */}
//           {/* 2. The Main App Layout (Wildcard)                         */}
//           {/* CRITICAL: We use "/*" here.                               */}
//           {/* This means ANY path (e.g., /, /customer, /sale-invoice)   */}
//           {/* will render AppLayout.                                    */}
//           {/* AppLayout then checks the URL and opens the correct Tab.  */}
//           {/* --------------------------------------------------------- */}
//           <Route path="/*" element={<AppLayout />} />
//         </Routes>
//       </Router>
//     </UnsavedChangesProvider>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UnsavedChangesProvider } from "./hooks/useUnsavedChangesWarning";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Wake server function - reusable for periodic calls
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
    // Initial wake-up
    wakeServer();

    // ** TESTING ONLY: Keep server awake every 14 minutes (Render free tier limit) **
    const intervalId = setInterval(() => {
      wakeServer();
    }, 14 * 60 * 1000); // 14 minutes = 840,000 ms (just under 15 min limit)

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [wakeServer]);

  useEffect(() => {
    // Show UI after first successful load (1.5 sec delay for initial wake)
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
    <UnsavedChangesProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </UnsavedChangesProvider>
  );
}
