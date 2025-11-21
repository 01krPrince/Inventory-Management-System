import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Ensure using react-router-dom if web
import { UnsavedChangesProvider } from "./hooks/useUnsavedChangesWarning";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
// NotFound is removed from here because AppLayout handles missing tabs/pages internally now
// or you can handle 404 inside AppLayout if the path doesn't match ComponentMap
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

export default function App() {
  return (
    <UnsavedChangesProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* --------------------------------------------------------- */}
          {/* 1. Authentication Routes (Public)                         */}
          {/* These must be defined BEFORE the wildcard route so        */}
          {/* they take precedence.                                     */}
          {/* --------------------------------------------------------- */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* --------------------------------------------------------- */}
          {/* 2. The Main App Layout (Wildcard)                         */}
          {/* CRITICAL: We use "/*" here.                               */}
          {/* This means ANY path (e.g., /, /customer, /sale-invoice)   */}
          {/* will render AppLayout.                                    */}
          {/* AppLayout then checks the URL and opens the correct Tab.  */}
          {/* --------------------------------------------------------- */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </UnsavedChangesProvider>
  );
}

// https://react-demo.inventory.com/
