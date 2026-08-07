import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiCpu,
  FiAlertTriangle,
  FiTrendingUp,
  FiZap,
  FiTool,
  FiSettings,
  FiChevronLeft,
  FiDroplet,
} from "react-icons/fi";

const menuItems = [
  { icon: FiGrid, title: "Dashboard", id: "dashboard", path: "/" },
  { icon: FiCpu, title: "Devices", id: "devices", path: "/devices" },
  { icon: FiAlertTriangle, title: "Alerts", id: "alerts", path: "/alerts" },
  { icon: FiTrendingUp, title: "Analytics", id: "analytics", path: "/analytics" },
  { icon: FiZap, title: "Prediction", id: "prediction", path: "/prediction" },
  { icon: FiTool, title: "Maintenance", id: "maintenance", path: "/maintenance" },
  { icon: FiSettings, title: "Settings", id: "settings", path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getActiveId = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    const match = menuItems.find((item) => item.path === path);
    return match ? match.id : "dashboard";
  };

  const activeItem = getActiveId();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 h-screen flex flex-col glass-effect z-40"
      style={{
        width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
        transition: "width var(--transition-base)",
        background: "var(--sidebar-bg)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid var(--glass-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 shrink-0"
        style={{
          height: "var(--navbar-height)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: "36px",
            height: "36px",
            background: "var(--accent-gradient)",
          }}
        >
          <FiDroplet className="text-white" size={18} />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1
                className="text-base font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Aqua<span className="gradient-text">Guardian</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                className="no-underline"
                style={{ textDecoration: "none" }}
              >
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 rounded-xl cursor-pointer relative overflow-hidden"
                  style={{
                    padding: collapsed ? "10px" : "10px 14px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive ? "var(--accent-glow)" : "transparent",
                    color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--bg-surface)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        width: "3px",
                        height: "20px",
                        background: "var(--accent-gradient)",
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <Icon size={18} className="shrink-0" />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div
        className="px-3 pb-4 shrink-0"
        style={{ borderTop: "1px solid var(--border-primary)" }}
      >
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 rounded-xl cursor-pointer border-none outline-none mt-3"
          style={{
            padding: "8px",
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            transition: "all var(--transition-fast)",
          }}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronLeft size={16} />
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
