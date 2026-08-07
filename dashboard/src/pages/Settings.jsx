import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiUser,
  FiMoon,
  FiSun,
  FiBell,
  FiServer,
  FiDatabase,
  FiCpu,
  FiInfo,
  FiGlobe,
  FiCheckCircle,
  FiXCircle,
  FiDroplet,
  FiShield,
  FiCode,
} from "react-icons/fi";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import PageTransition from "../components/ui/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { useTheme } from "../context/ThemeContext";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [apiStatus, setApiStatus] = useState("checking");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    alerts: true,
    maintenance: true,
    reports: false,
    email: false,
  });

  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      const [rootRes, summaryRes] = await Promise.allSettled([
        api.get("/../../"),
        api.get("/dashboard/summary"),
      ]);

      setApiStatus(rootRes.status === "fulfilled" || summaryRes.status === "fulfilled" ? "connected" : "disconnected");
      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data);
    } catch {
      setApiStatus("disconnected");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="card" count={2} />
      </div>
    );
  }

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-6 space-y-8 max-w-[1200px] mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <SectionTitle
            icon={FiSettings}
            title="Settings"
            description="System configuration and preferences"
          />
        </motion.div>

        {/* Profile Section */}
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex items-center gap-5">
              <div
                className="flex items-center justify-center rounded-2xl shrink-0"
                style={{
                  width: "72px",
                  height: "72px",
                  background: "var(--accent-gradient)",
                  boxShadow: "0 0 24px var(--accent-glow)",
                }}
              >
                <span className="text-2xl font-bold text-white">AK</span>
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Anantha Kumar
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  System Administrator
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: "var(--accent-glow)",
                      color: "var(--accent-cyan)",
                      border: "1px solid rgba(6,182,212,0.3)",
                    }}
                  >
                    Admin
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    ananthakumar@aquaguardian.io
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Theme + Notifications */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme */}
            <GlassCard>
              <SettingHeader icon={FiMoon} title="Appearance" />
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      Dark Mode
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Toggle between dark and light theme
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                </div>

                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "var(--accent-glow)",
                      color: "var(--accent-cyan)",
                    }}
                  >
                    {theme === "dark" ? <FiMoon size={14} /> : <FiSun size={14} />}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      Current: {theme === "dark" ? "Dark" : "Light"} Mode
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      Optimized for {theme === "dark" ? "low-light environments" : "bright environments"}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Notifications */}
            <GlassCard>
              <SettingHeader icon={FiBell} title="Notifications" />
              <div className="space-y-4 mt-4">
                {[
                  { key: "alerts", label: "Alert Notifications", desc: "Get notified on critical water quality alerts" },
                  { key: "maintenance", label: "Maintenance Alerts", desc: "Receive maintenance reminders" },
                  { key: "reports", label: "Weekly Reports", desc: "Automated weekly analytics summary" },
                  { key: "email", label: "Email Digest", desc: "Daily email with key metrics" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {item.label}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {item.desc}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={notifications[item.key]}
                      onChange={() => toggleNotification(item.key)}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div variants={fadeUp}>
          <SectionTitle
            icon={FiServer}
            title="System Status"
            description="Backend services and connectivity"
            delay={0.2}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatusCard
              icon={FiGlobe}
              label="API Server"
              status={apiStatus === "connected" ? "Connected" : "Disconnected"}
              isOnline={apiStatus === "connected"}
              detail="FastAPI v1.0.0"
              delay={0.1}
            />
            <StatusCard
              icon={FiDatabase}
              label="Database"
              status={apiStatus === "connected" ? "Connected" : "Disconnected"}
              isOnline={apiStatus === "connected"}
              detail="PostgreSQL (Supabase)"
              delay={0.15}
            />
            <StatusCard
              icon={FiCpu}
              label="Connected Devices"
              status={summary ? `${summary.active_devices}/${summary.total_devices} Online` : "Unknown"}
              isOnline={summary?.active_devices > 0}
              detail={`${summary?.total_readings || 0} total readings`}
              delay={0.2}
            />
          </div>
        </motion.div>

        {/* About */}
        <motion.div variants={fadeUp}>
          <GlassCard>
            <SettingHeader icon={FiInfo} title="About AquaGuardian" />
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--accent-gradient)",
                    boxShadow: "0 0 20px var(--accent-glow)",
                  }}
                >
                  <FiDroplet size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    Aqua<span className="gradient-text">Guardian</span>
                  </h4>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Intelligent IoT Water Quality Monitoring System
                  </p>
                </div>
              </div>

              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <InfoItem icon={FiCode} label="Version" value="1.0.0" />
                <InfoItem icon={FiServer} label="Backend" value="FastAPI" />
                <InfoItem icon={FiDatabase} label="Database" value="PostgreSQL" />
                <InfoItem icon={FiShield} label="ML Engine" value="scikit-learn" />
              </div>

              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                AquaGuardian is an intelligent IoT-based water quality monitoring platform that uses real-time sensor data,
                machine learning predictions, and predictive maintenance to ensure safe and clean water. Built with
                FastAPI, React, and scikit-learn.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <div className="h-6" />
      </motion.div>
    </PageTransition>
  );
}

function SettingHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-lg"
        style={{
          width: "28px",
          height: "28px",
          background: "var(--accent-glow)",
          color: "var(--accent-cyan)",
        }}
      >
        <Icon size={14} />
      </div>
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <motion.button
      onClick={onChange}
      className="relative rounded-full cursor-pointer border-none outline-none p-0"
      style={{
        width: "44px",
        height: "24px",
        background: checked ? "var(--accent-cyan)" : "var(--border-primary)",
        transition: "background var(--transition-fast)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 rounded-full"
        animate={{
          left: checked ? "22px" : "2px",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: "20px",
          height: "20px",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </motion.button>
  );
}

function StatusCard({ icon: Icon, label, status, isOnline, detail, delay }) {
  return (
    <GlassCard delay={delay}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: "40px",
            height: "40px",
            background: isOnline ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            color: isOnline ? "var(--color-success)" : "var(--color-danger)",
          }}
        >
          <Icon size={18} />
        </div>
        {isOnline ? (
          <FiCheckCircle size={16} style={{ color: "var(--color-success)" }} />
        ) : (
          <FiXCircle size={16} style={{ color: "var(--color-danger)" }} />
        )}
      </div>

      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-sm font-semibold mb-1" style={{
        color: isOnline ? "var(--color-success)" : "var(--color-danger)",
      }}>
        {status}
      </p>
      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
        {detail}
      </p>
    </GlassCard>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <Icon size={14} style={{ color: "var(--accent-cyan)" }} />
      <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}
