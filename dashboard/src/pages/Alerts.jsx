import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiShield,
  FiSearch,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
} from "react-icons/fi";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import PageTransition from "../components/ui/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import SearchInput from "../components/ui/SearchInput";
import FilterChips from "../components/ui/FilterChips";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/ui/StatCard";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

const ITEMS_PER_PAGE = 15;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const severityConfig = {
  HIGH: {
    icon: FiAlertCircle,
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.2)",
  },
  MEDIUM: {
    icon: FiAlertTriangle,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.2)",
  },
  LOW: {
    icon: FiInfo,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.2)",
  },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/alerts/");
      setAlerts(res.data);
    } catch (err) {
      setError(err.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const stats = useMemo(() => {
    const total = alerts.length;
    const high = alerts.filter((a) => a.severity === "HIGH").length;
    const medium = alerts.filter((a) => a.severity === "MEDIUM").length;
    const low = alerts.filter((a) => a.severity === "LOW").length;
    const latest = alerts.length > 0 ? alerts[0] : null;
    return { total, high, medium, low, latest };
  }, [alerts]);

  const filterOptions = useMemo(
    () => [
      { label: "All", value: "all", count: stats.total },
      { label: "High", value: "HIGH", count: stats.high },
      { label: "Medium", value: "MEDIUM", count: stats.medium },
      { label: "Low", value: "LOW", count: stats.low },
    ],
    [stats]
  );

  const filtered = useMemo(() => {
    let result = alerts;
    if (filter !== "all") {
      result = result.filter((a) => a.severity === filter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.message.toLowerCase().includes(q) ||
          a.device_id.toLowerCase().includes(q) ||
          a.alert_type.toLowerCase().includes(q)
      );
    }
    return result;
  }, [alerts, filter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [filter, searchQuery]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="p-6">
          <ErrorState message={error} onRetry={fetchAlerts} />
        </div>
      </PageTransition>
    );
  }

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
            icon={FiAlertTriangle}
            title="Alert Center"
            description="Real-time alerts from water quality monitoring sensors"
          />
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <StatCard
              title="Total Alerts"
              value={stats.total}
              icon={FiShield}
              color="var(--accent-cyan)"
              delay={0.1}
            />
            <StatCard
              title="High Severity"
              value={stats.high}
              icon={FiAlertCircle}
              color="var(--color-danger)"
              delay={0.15}
            />
            <StatCard
              title="Medium"
              value={stats.medium}
              icon={FiAlertTriangle}
              color="var(--color-warning)"
              delay={0.2}
            />
            <StatCard
              title="Low"
              value={stats.low}
              icon={FiInfo}
              color="var(--color-success)"
              delay={0.25}
            />
          </div>
        </motion.div>

        {/* Search + Filter */}
        <motion.div variants={fadeUp}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <FilterChips
              options={filterOptions}
              active={filter}
              onChange={setFilter}
            />
            <div className="w-full sm:w-72">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search alerts..."
              />
            </div>
          </div>
        </motion.div>

        {/* Alert Timeline */}
        {paginated.length === 0 ? (
          <EmptyState
            icon={FiSearch}
            title="No Alerts Found"
            description={
              searchQuery || filter !== "all"
                ? "No alerts match your criteria"
                : "No alerts have been generated yet. Your water quality is excellent!"
            }
          />
        ) : (
          <motion.div variants={stagger} className="space-y-3">
            {paginated.map((alert, index) => (
              <AlertItem key={alert.id} alert={alert} index={index} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {filtered.length > ITEMS_PER_PAGE && (
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border-none outline-none disabled:opacity-30"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-secondary)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <FiChevronLeft size={14} /> Prev
            </motion.button>

            <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              Page {page} of {totalPages}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border-none outline-none disabled:opacity-30"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-secondary)",
                border: "1px solid var(--glass-border)",
              }}
            >
              Next <FiChevronRight size={14} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </PageTransition>
  );
}

function AlertItem({ alert, index }) {
  const config = severityConfig[alert.severity] || severityConfig.LOW;
  const Icon = config.icon;
  const date = new Date(alert.created_at);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, delay: index * 0.04 },
        },
      }}
    >
      <GlassCard delay={0} padding="p-4">
        <div className="flex items-start gap-4">
          {/* Severity icon */}
          <div
            className="flex items-center justify-center rounded-xl shrink-0 mt-0.5"
            style={{
              width: "40px",
              height: "40px",
              background: config.bg,
              color: config.color,
              border: `1px solid ${config.border}`,
            }}
          >
            <Icon size={18} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {alert.alert_type}
                  </span>
                  <StatusBadge status={alert.severity} size="xs" />
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {alert.message}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 mt-2.5">
              <div className="flex items-center gap-1.5">
                <FiCpu size={11} style={{ color: "var(--text-muted)" }} />
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {alert.device_id}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiClock size={11} style={{ color: "var(--text-muted)" }} />
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline dot */}
          <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: config.color,
                boxShadow: `0 0 8px ${config.color}50`,
              }}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
