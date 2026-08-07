import { motion } from "framer-motion";
import { FiDroplet, FiThermometer, FiActivity, FiZap } from "react-icons/fi";
import useAnimatedCounter from "../../hooks/useAnimatedCounter";
import GlassCard from "../ui/GlassCard";

const sensorConfig = {
  ph: {
    icon: FiDroplet,
    label: "pH Level",
    unit: "",
    color: "#3b82f6",
    min: 0,
    max: 14,
    safe: [6.5, 8.5],
    description: "Acidity / Alkalinity",
  },
  temperature: {
    icon: FiThermometer,
    label: "Temperature",
    unit: "°C",
    color: "#ef4444",
    min: 0,
    max: 50,
    safe: [15, 35],
    description: "Water Temperature",
  },
  turbidity: {
    icon: FiActivity,
    label: "Turbidity",
    unit: "NTU",
    color: "#f59e0b",
    min: 0,
    max: 100,
    safe: [0, 5],
    description: "Water Clarity",
  },
  tds: {
    icon: FiZap,
    label: "TDS",
    unit: "ppm",
    color: "#06b6d4",
    min: 0,
    max: 1500,
    safe: [0, 500],
    description: "Total Dissolved Solids",
  },
};

export default function SensorCard({ type, value, delay = 0 }) {
  const config = sensorConfig[type] || sensorConfig.ph;
  const Icon = config.icon;

  const numericValue = typeof value === "number" ? value : null;
  const animatedValue = useAnimatedCounter(numericValue, 1200, numericValue !== null);
  const displayValue = numericValue !== null ? Math.round(animatedValue * 10) / 10 : "--";

  // Calculate range position
  const normalizedValue = numericValue !== null
    ? Math.min(Math.max((numericValue - config.min) / (config.max - config.min), 0), 1)
    : 0;

  // Determine if in safe range
  const isSafe = numericValue !== null &&
    numericValue >= config.safe[0] &&
    numericValue <= config.safe[1];

  const statusColor = isSafe ? "var(--color-success)" : "var(--color-warning)";

  return (
    <GlassCard delay={delay}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {config.label}
          </p>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            {config.description}
          </p>
        </div>

        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: "32px",
            height: "32px",
            background: `${config.color}15`,
            color: config.color,
          }}
        >
          <Icon size={15} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <motion.span
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {displayValue}
        </motion.span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {config.unit}
        </span>
      </div>

      {/* Range Bar */}
      <div className="relative">
        <div
          className="w-full rounded-full overflow-hidden"
          style={{
            height: "4px",
            background: "var(--border-primary)",
          }}
        >
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${normalizedValue * 100}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            style={{
              background: config.color,
              boxShadow: `0 0 8px ${config.color}40`,
            }}
          />
        </div>

        {/* Safe Range Indicator */}
        <div className="flex justify-between mt-2.5">
          <span
            className="text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            {config.min}
          </span>
          <span
            className="text-[10px] font-medium flex items-center gap-1"
            style={{ color: statusColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            {isSafe ? "Normal" : "Alert"}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            {config.max}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
