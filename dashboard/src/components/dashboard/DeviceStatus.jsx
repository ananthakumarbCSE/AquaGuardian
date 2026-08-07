import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";

export default function DeviceStatus({ summary }) {
  if (!summary) return null;

  const { total_devices, active_devices, inactive_devices } = summary;
  const activePercent = total_devices > 0
    ? Math.round((active_devices / total_devices) * 100)
    : 0;

  return (
    <GlassCard delay={0.6}>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "28px",
            height: "28px",
            background: "rgba(59, 130, 246, 0.1)",
            color: "var(--color-info)",
          }}
        >
          <FiCpu size={14} />
        </div>
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Devices
        </h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {total_devices}
          </p>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Total
          </p>
        </div>
        <div className="text-center">
          <p
            className="text-xl font-bold"
            style={{ color: "var(--color-success)" }}
          >
            {active_devices}
          </p>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Online
          </p>
        </div>
        <div className="text-center">
          <p
            className="text-xl font-bold"
            style={{ color: inactive_devices > 0 ? "var(--color-danger)" : "var(--text-muted)" }}
          >
            {inactive_devices}
          </p>
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Offline
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Uptime
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-success)" }}
          >
            {activePercent}%
          </span>
        </div>
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: "4px", background: "var(--border-primary)" }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${activePercent}%` }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            style={{
              background: "var(--color-success)",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)",
            }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
