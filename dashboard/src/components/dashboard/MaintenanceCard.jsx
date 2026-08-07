import { motion } from "framer-motion";
import { FiTool, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";
import StatusBadge from "../ui/StatusBadge";

export default function MaintenanceCard({ maintenance }) {
  if (!maintenance) {
    return (
      <GlassCard delay={0.55}>
        <div
          className="flex flex-col items-center justify-center py-8"
          style={{ color: "var(--text-muted)" }}
        >
          <FiTool size={24} className="mb-2 opacity-30" />
          <p className="text-sm">Loading maintenance...</p>
        </div>
      </GlassCard>
    );
  }

  const isRequired = maintenance.maintenance_required;

  return (
    <GlassCard delay={0.55}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "28px",
              height: "28px",
              background: isRequired
                ? "rgba(245, 158, 11, 0.1)"
                : "rgba(16, 185, 129, 0.1)",
              color: isRequired
                ? "var(--color-warning)"
                : "var(--color-success)",
            }}
          >
            <FiTool size={14} />
          </div>
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Maintenance
          </h3>
        </div>

        <StatusBadge status={maintenance.priority} size="xs" />
      </div>

      {/* Status */}
      <div
        className="flex items-center gap-2 p-3 rounded-xl mb-4"
        style={{
          background: isRequired
            ? "rgba(245, 158, 11, 0.05)"
            : "rgba(16, 185, 129, 0.05)",
          border: `1px solid ${
            isRequired
              ? "rgba(245, 158, 11, 0.15)"
              : "rgba(16, 185, 129, 0.15)"
          }`,
        }}
      >
        {isRequired ? (
          <FiAlertCircle
            size={16}
            style={{ color: "var(--color-warning)", shrink: 0 }}
          />
        ) : (
          <FiCheckCircle
            size={16}
            style={{ color: "var(--color-success)", shrink: 0 }}
          />
        )}
        <span
          className="text-xs font-medium"
          style={{
            color: isRequired
              ? "var(--color-warning)"
              : "var(--color-success)",
          }}
        >
          {isRequired ? "Maintenance Required" : "All Systems Operational"}
        </span>
      </div>

      {/* Recommendations */}
      {maintenance.recommendations &&
        maintenance.recommendations.length > 0 && (
          <div className="space-y-3">
            <p
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Recommendations
            </p>
            {maintenance.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-2 p-2.5 rounded-lg"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <span
                  className="text-xs mt-0.5 shrink-0"
                  style={{ color: "var(--accent-cyan)" }}
                >
                  →
                </span>
                <span
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {rec}
                </span>
              </motion.div>
            ))}
          </div>
        )}
    </GlassCard>
  );
}
