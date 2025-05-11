import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// NotFound is now lazy loaded
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import SeasonBanner from "@/components/layout/SeasonBanner";
import ScrollToTop from "@/components/ScrollToTop";
import PreloadFonts from "@/components/ui/preload-fonts";


import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

// Pages - Lazy loaded for improved performance and reduced bundle size
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ResourcePreloader from "@/components/performance/ResourcePreloader";
import PerformanceHeaders from "@/components/performance/PerformanceHeaders";

// Eagerly load the Home page for faster initial load
import Home from "@/pages/Home";

// Lazy load other pages to reduce initial bundle size
const Hotel = lazy(() => import("@/pages/Hotel"));
const Menu = lazy(() => import("@/pages/Menu"));
const Events = lazy(() => import("@/pages/Events"));
const Careers = lazy(() => import("@/pages/Careers"));
const Contact = lazy(() => import("@/pages/Contact"));
const Terms = lazy(() => import("@/pages/Terms"));
const Admin = lazy(() => import("@/pages/Admin"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/admin/Dashboard"));
const Reservations = lazy(() => import("@/admin/Reservations"));
const Settings = lazy(() => import("@/admin/Settings"));
const ReservationsCalendar = lazy(() => import("@/pages/ReservationsCalendar"));
const AttractionPage = lazy(() => import("@/pages/AttractionPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

// React Query DevTools (only in development)
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function Router() {
  // Track authentication status and store in localStorage
  const { isAdmin } = useAdminAuth();

  // Hide navbar and footer on admin pages
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/admin");
  const isLoginPage = location === "/login";
  const isReservationsPage = location === "/reservations-calendar";

  // Force white background on component mount
  useEffect(() => {
    // Apply background color to all key elements
    document.documentElement.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";
    
    // Find the root element and ensure it has white background
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.backgroundColor = "#ffffff";
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ backgroundColor: "#ffffff" }}>
      {/* Scroll to top on route change */}
      <ScrollToTop />
      
      {!isAdminPage && !isLoginPage && !isReservationsPage && <SeasonBanner />}
      {!isAdminPage && !isLoginPage && !isReservationsPage && <NavBar />}
      
      <main className="flex-grow bg-white" style={{ backgroundColor: "#ffffff" }}>
        <Suspense fallback={<LoadingSpinner size="large" />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/waterpark">
              {() => {
                window.location.href = "/attraction/waterpark-slides";
                return null;
              }}
            </Route>
            <Route path="/hotel" component={Hotel} />
            <Route path="/menu" component={Menu} />
            <Route path="/events" component={Events} />
            <Route path="/careers" component={Careers} />
            <Route path="/contact" component={Contact} />
            <Route path="/terms" component={Terms} />
            <Route path="/admin/*" component={Admin} />
            <Route path="/login" component={Login} />
            <Route path="/reservations-calendar" component={ReservationsCalendar} />
            <Route path="/attraction/:key" component={AttractionPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      
      {!isAdminPage && !isLoginPage && !isReservationsPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PerformanceHeaders />
        <PreloadFonts />
        <ResourcePreloader />
        <Toaster />
        <Router />
        {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}



export default App;
