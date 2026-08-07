import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import AnimatedBackground from "./components/layout/AnimatedBackground";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import LoadingSkeleton from "./components/ui/LoadingSkeleton";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Devices = lazy(() => import("./pages/Devices"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Prediction = lazy(() => import("./pages/Prediction"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Settings = lazy(() => import("./pages/Settings"));

function PageLoader() {
  return (
    <div className="p-6 space-y-6">
      <LoadingSkeleton variant="card" count={4} />
      <LoadingSkeleton variant="chart" />
    </div>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-h-screen relative"
        style={{
          marginLeft: "var(--sidebar-width)",
          transition: "margin-left var(--transition-base)",
          zIndex: 1,
        }}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;