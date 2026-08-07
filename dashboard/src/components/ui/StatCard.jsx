import { motion } from "framer-motion";
import useAnimatedCounter from "../../hooks/useAnimatedCounter";
import GlassCard from "./GlassCard";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "var(--accent-cyan)",
  suffix = "",
  delay = 0,
  trend,
}) {
  const numericValue = typeof value === "number" ? value : null;
  const animatedValue = useAnimatedCounter(numericValue, 1200, numericValue !== null);

  const displayValue = numericValue !== null ? Math.round(animatedValue) : value;

  return (
    <GlassCard delay={delay}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </p>

          <div className="flex items-baseline gap-1.5">
            <motion.span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {displayValue ?? "--"}
            </motion.span>
            {suffix && (
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                {suffix}
              </span>
            )}
          </div>

          {trend && (
            <div
              className="flex items-center gap-1 mt-1.5"
              style={{
                color:
                  trend === "up"
                    ? "var(--color-success)"
                    : trend === "down"
                    ? "var(--color-danger)"
                    : "var(--text-muted)",
              }}
            >
              <span className="text-xs font-medium">
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}{" "}
                {trend === "up"
                  ? "Improving"
                  : trend === "down"
                  ? "Declining"
                  : "Stable"}
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: "40px",
              height: "40px",
              background: `${color}15`,
              color: color,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
