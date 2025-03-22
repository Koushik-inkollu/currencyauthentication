
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
import "./styles/currencyAuth.css";

// Create QueryClient outside of component to avoid React Hook errors
const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // While checking auth status, return nothing or a loading spinner
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If user is authenticated, render the child routes
  return <Outlet />;
};

// Public route that redirects to landing page if user is already logged in
const PublicRoute = () => {
  const { user, loading } = useAuth();
  
  // While checking auth status, return nothing or a loading spinner
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If user is authenticated, redirect to landing page
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  // If user is not authenticated, render the auth page
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
                {/* Public routes */}
                <Route element={<PublicRoute />}>
                  <Route path="/auth" element={<Auth />} />
                </Route>
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/currency-auth" element={<CurrencyAuth />} />
                </Route>
                
                {/* Redirect root to auth page or home depending on auth status */}
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
