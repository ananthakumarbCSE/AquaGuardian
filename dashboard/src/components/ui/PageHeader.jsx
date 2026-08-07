import { motion } from "framer-motion";
import { FiDroplet, FiActivity } from "react-icons/fi";
import StatusBadge from "./StatusBadge";

export default function PageHeader({ summary, latest }) {
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-2"
        >
          <FiDroplet size={14} style={{ color: "var(--accent-cyan)" }} />
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--accent-cyan)" }}
          >
            AquaGuardian
          </span>
        </motion.div>

        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {greeting} 👋
        </h1>

        <p
          className="text-sm mt-2"
          style={{ color: "var(--text-muted)" }}
        >
          Real-time water quality monitoring and predictive analysis
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        {/* Live Status */}
        {latest && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <FiActivity size={13} style={{ color: "var(--accent-cyan)" }} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Status:
            </span>
            <StatusBadge status={latest.water_status} size="xs" />
          </div>
        )}

        {/* Devices Online */}
        {summary && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="status-dot status-dot--online" />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {summary.active_devices}/{summary.total_devices} Online
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
