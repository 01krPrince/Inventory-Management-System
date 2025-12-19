import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your components
import LandingPage from "./component/LandingPage";
import ExploreKitchens from "./component/ExploreKitchens"; // Ensure you saved the previous code in this file

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Home Page */}
        <Route path="/" element={<LandingPage />} />

        {/* The Explore Kitchens Page */}
        <Route path="/explore" element={<ExploreKitchens />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
