import { motion } from "framer-motion";
import { FiRefreshCw, FiAlertTriangle, FiZap, FiTool } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";

const actions = [
  {
    icon: FiRefreshCw,
    label: "Refresh Data",
    color: "var(--accent-cyan)",
    bg: "rgba(6, 182, 212, 0.1)",
    id: "refresh",
  },
  {
    icon: FiAlertTriangle,
    label: "View Alerts",
    color: "var(--color-danger)",
    bg: "rgba(239, 68, 68, 0.1)",
    id: "alerts",
  },
  {
    icon: FiZap,
    label: "Run Prediction",
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.1)",
    id: "prediction",
  },
  {
    icon: FiTool,
    label: "Maintenance",
    color: "var(--color-warning)",
    bg: "rgba(245, 158, 11, 0.1)",
    id: "maintenance",
  },
];

export default function QuickActions({ onRefresh }) {
  const handleAction = (id) => {
    if (id === "refresh" && onRefresh) {
      onRefresh();
    }
    // Other actions can scroll to respective sections or open modals
  };

  return (
    <GlassCard delay={0.7}>
      <h3
        className="text-sm font-semibold uppercase tracking-wider mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.id}
              onClick={() => handleAction(action.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer border-none outline-none"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-primary)",
                transition: "all var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${action.color}30`;
                e.currentTarget.style.background = action.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-primary)";
                e.currentTarget.style.background = "var(--bg-surface)";
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "32px",
                  height: "32px",
                  background: action.bg,
                  color: action.color,
                }}
              >
                <Icon size={15} />
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </GlassCard>
  );
}
