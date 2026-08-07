import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBell, FiSun, FiMoon, FiRefreshCw } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const pageTitles = {
  "/": { title: "Water Quality Dashboard", subtitle: null },
  "/devices": { title: "Device Management", subtitle: "Monitor and manage connected IoT devices" },
  "/alerts": { title: "Alert Center", subtitle: "Real-time water quality alerts and notifications" },
  "/analytics": { title: "Analytics", subtitle: "Comprehensive water quality data analysis" },
  "/prediction": { title: "AI Prediction", subtitle: "Machine learning powered water quality forecasting" },
  "/maintenance": { title: "Predictive Maintenance", subtitle: "Smart maintenance scheduling and recommendations" },
  "/settings": { title: "Settings", subtitle: "System configuration and preferences" },
};

export default function Navbar({ alertCount = 0, onRefresh, lastRefresh }) {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const pageInfo = pageTitles[location.pathname] || pageTitles["/"];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="sticky top-0 z-30 glass-effect"
      style={{
        height: "var(--navbar-height)",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left — Title */}
        <div className="flex items-center gap-4">
          <div>
            <motion.h2
              key={pageInfo.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)", lineHeight: 1.2 }}
            >
              {pageInfo.title}
            </motion.h2>
            <p
              className="text-xs"
              style={{ color: "var(--text-muted)", marginTop: "2px" }}
            >
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          {/* Live Clock */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg mr-1"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <span className="status-dot status-dot--online" />
            <span
              className="text-xs font-mono font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {formattedTime}
            </span>
          </div>

          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 180 }}
            onClick={onRefresh}
            className="flex items-center justify-center rounded-lg cursor-pointer border-none outline-none"
            style={{
              width: "36px",
              height: "36px",
              background: "var(--bg-surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-primary)",
              transition: "all var(--transition-fast)",
            }}
            title="Refresh data"
          >
            <FiRefreshCw size={15} />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="relative flex items-center justify-center rounded-lg cursor-pointer border-none outline-none"
            style={{
              width: "36px",
              height: "36px",
              background: "var(--bg-surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-primary)",
              transition: "all var(--transition-fast)",
            }}
          >
            <FiBell size={15} />
            {alertCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex items-center justify-center text-white text-[10px] font-bold rounded-full"
                style={{
                  width: "18px",
                  height: "18px",
                  background: "var(--color-danger)",
                  boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)",
                }}
              >
                {alertCount > 9 ? "9+" : alertCount}
              </motion.span>
            )}
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 180 }}
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-lg cursor-pointer border-none outline-none"
            style={{
              width: "36px",
              height: "36px",
              background: "var(--bg-surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-primary)",
              transition: "all var(--transition-fast)",
            }}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <FiSun size={15} /> : <FiMoon size={15} />}
            </motion.div>
          </motion.button>

          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-full font-semibold text-sm text-white ml-1"
            style={{
              width: "36px",
              height: "36px",
              background: "var(--accent-gradient)",
              boxShadow: "0 0 12px var(--accent-glow)",
            }}
          >
            AK
          </div>
        </div>
      </div>
    </motion.header>
  );
}
