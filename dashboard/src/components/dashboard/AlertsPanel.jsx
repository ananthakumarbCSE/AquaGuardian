import { motion } from "framer-motion";
import { FiAlertTriangle, FiClock } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";
import StatusBadge from "../ui/StatusBadge";

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AlertsPanel({ alerts = [] }) {
  const displayAlerts = alerts.slice(0, 6);

  return (
    <GlassCard delay={0.5} padding="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--color-danger)",
            }}
          >
            <FiAlertTriangle size={14} />
          </div>
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Recent Alerts
          </h3>
        </div>

        <span
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {alerts.length} total
        </span>
      </div>

      {displayAlerts.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-8"
          style={{ color: "var(--text-muted)" }}
        >
          <FiAlertTriangle size={24} className="mb-2 opacity-30" />
          <p className="text-sm">No alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-primary)",
                transition: "border-color var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-primary)";
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={alert.severity} size="xs" />
                  <span
                    className="text-xs font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {alert.alert_type}
                  </span>
                </div>

                <p
                  className="text-xs truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {alert.message}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span
                    className="text-[10px] flex items-center gap-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <FiClock size={10} />
                    {timeAgo(alert.created_at)}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {alert.device_id}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
