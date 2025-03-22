
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import CurrencyAuth from "./pages/CurrencyAuth"; 
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import "./styles/currencyAuth.css"; // Import the new CSS file

// Create QueryClient outside of component to avoid React Hook errors
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // During initial load, show nothing to avoid flashing content
  if (loading) return null;

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the children routes
  return <Outlet />;
};

// Public route that redirects if logged in
const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();
  
  // During initial load, show nothing to avoid flashing content
  if (loading) return null;

  // If user is authenticated, redirect to landing page
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If user is not authenticated, render the children routes
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes that redirect to home if logged in */}
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/auth" element={<Auth />} />
                </Route>

                {/* Protected routes that require authentication */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/currency-auth" element={<CurrencyAuth />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
