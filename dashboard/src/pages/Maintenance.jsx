import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiTool,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiDroplet,
  FiThermometer,
  FiActivity,
  FiZap,
  FiAlertTriangle,
} from "react-icons/fi";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import PageTransition from "../components/ui/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import StatusBadge from "../components/ui/StatusBadge";
import AnimatedProgress from "../components/ui/AnimatedProgress";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const sensorThresholds = {
  ph: { label: "pH Level", icon: FiDroplet, color: "#3b82f6", safe: [6.5, 8.5], unit: "" },
  temperature: { label: "Temperature", icon: FiThermometer, color: "#ef4444", safe: [15, 35], unit: "°C" },
  turbidity: { label: "Turbidity", icon: FiActivity, color: "#f59e0b", safe: [0, 5], unit: "NTU" },
  tds: { label: "TDS", icon: FiZap, color: "#06b6d4", safe: [0, 500], unit: "ppm" },
};

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState(null);
  const [latestReading, setLatestReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mainRes, latestRes] = await Promise.allSettled([
        api.get("/maintenance/"),
        api.get("/dashboard/latest-reading"),
      ]);

      if (mainRes.status === "fulfilled") setMaintenance(mainRes.value.data);
      if (latestRes.status === "fulfilled") setLatestReading(latestRes.value.data);
    } catch (err) {
      setError(err.message || "Failed to load maintenance data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="p-6">
          <ErrorState message={error} onRetry={fetchData} />
        </div>
      </PageTransition>
    );
  }

  const priorityColor =
    maintenance?.priority === "HIGH"
      ? { color: "var(--color-danger)", bg: "rgba(239,68,68,0.1)" }
      : maintenance?.priority === "MEDIUM"
      ? { color: "var(--color-warning)", bg: "rgba(245,158,11,0.1)" }
      : { color: "var(--color-success)", bg: "rgba(16,185,129,0.1)" };

  const urgencyScore =
    maintenance?.priority === "HIGH" ? 85 :
    maintenance?.priority === "MEDIUM" ? 50 : 15;

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-6 space-y-8 max-w-[1600px] mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <SectionTitle
            icon={FiTool}
            title="Predictive Maintenance"
            description="AI-driven maintenance scheduling and smart recommendations"
          />
        </motion.div>

        {/* Status Hero */}
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 py-2">
              {/* Status Icon */}
              <motion.div
                animate={
                  maintenance?.maintenance_required
                    ? { scale: [1, 1.05, 1] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center rounded-2xl shrink-0"
                style={{
                  width: "80px",
                  height: "80px",
                  background: maintenance?.maintenance_required
                    ? priorityColor.bg
                    : "rgba(16,185,129,0.1)",
                  color: maintenance?.maintenance_required
                    ? priorityColor.color
                    : "var(--color-success)",
                }}
              >
                {maintenance?.maintenance_required ? (
                  <FiAlertCircle size={36} />
                ) : (
                  <FiCheckCircle size={36} />
                )}
              </motion.div>

              {/* Status Text */}
              <div className="text-center sm:text-left flex-1">
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {maintenance?.maintenance_required
                    ? "Maintenance Required"
                    : "System Healthy"}
                </h2>
                <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                  {maintenance?.maintenance_required
                    ? "One or more water quality parameters are outside safe range"
                    : "All water quality parameters are within normal operating range"}
                </p>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <StatusBadge status={maintenance?.priority || "LOW"} size="md" />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Priority Level
                  </span>
                </div>
              </div>

              {/* Urgency Gauge */}
              <div className="shrink-0">
                <div className="relative" style={{ width: 100, height: 100 }}>
                  <svg width="100" height="100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="42" stroke="var(--border-primary)" strokeWidth="6" fill="none" />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      stroke={priorityColor.color}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - urgencyScore / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ filter: `drop-shadow(0 0 4px ${priorityColor.color}50)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                      {urgencyScore}%
                    </span>
                    <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                      Urgency
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={fadeUp}>
          <SectionTitle
            icon={FiShield}
            title="Maintenance Recommendations"
            description="Action items based on current sensor analysis"
            delay={0.2}
          />

          {maintenance?.recommendations?.length > 0 ? (
            <motion.div variants={stagger} className="space-y-3">
              {maintenance.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.4, delay: index * 0.08 },
                    },
                  }}
                >
                  <GlassCard delay={0} padding="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex items-center justify-center rounded-xl shrink-0 mt-0.5"
                        style={{
                          width: "40px",
                          height: "40px",
                          background: priorityColor.bg,
                          color: priorityColor.color,
                        }}
                      >
                        <FiAlertTriangle size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            Action Item #{index + 1}
                          </span>
                          <StatusBadge status={maintenance.priority} size="xs" />
                        </div>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {rec}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <FiClock size={11} style={{ color: "var(--text-muted)" }} />
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          Now
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon={FiCheckCircle}
              title="No Maintenance Required"
              description="All systems are operating within normal parameters. Keep monitoring for changes."
            />
          )}
        </motion.div>

        {/* Current Sensor Readings */}
        {latestReading && (
          <motion.div variants={fadeUp}>
            <SectionTitle
              icon={FiActivity}
              title="Current Sensor Status"
              description="Latest readings that triggered maintenance analysis"
              delay={0.3}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Object.entries(sensorThresholds).map(([key, config], index) => {
                const value = latestReading[key];
                const Icon = config.icon;
                const isSafe = value >= config.safe[0] && value <= config.safe[1];

                return (
                  <GlassCard key={key} delay={0.1 + index * 0.05}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className="flex items-center justify-center rounded-lg"
                        style={{
                          width: "28px",
                          height: "28px",
                          background: `${config.color}15`,
                          color: config.color,
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        {config.label}
                      </span>
                    </div>

                    <p className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                      {typeof value === "number" ? value.toFixed(1) : "--"}
                      <span className="text-xs font-normal ml-1" style={{ color: "var(--text-muted)" }}>
                        {config.unit}
                      </span>
                    </p>

                    <AnimatedProgress
                      value={value || 0}
                      max={config.safe[1] * 1.5 || 100}
                      color={isSafe ? config.color : "var(--color-danger)"}
                      height={4}
                      delay={0.3 + index * 0.05}
                    />

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Safe: {config.safe[0]}–{config.safe[1]}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: isSafe ? "var(--color-success)" : "var(--color-danger)",
                          }}
                        />
                        <span
                          className="text-[10px] font-medium"
                          style={{
                            color: isSafe ? "var(--color-success)" : "var(--color-danger)",
                          }}
                        >
                          {isSafe ? "OK" : "Alert"}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="h-6" />
      </motion.div>
    </PageTransition>
  );
}
