import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UnsavedChangesProvider } from './hooks/useUnsavedChangesWarning';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import AppLayout from './layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import LandingPage from './layout/landingPage';

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <div>
        <Toaster />
      </div>
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
  return (
    <AuthProvider>
      <UnsavedChangesProvider>
        {/* 2. WRAP YOUR ROUTES WITH THE PROVIDER HERE */}
        <AppRoutes />
      </UnsavedChangesProvider>
    </AuthProvider>
  );
}
