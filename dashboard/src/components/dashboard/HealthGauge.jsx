import { motion } from "framer-motion";
import useAnimatedCounter from "../../hooks/useAnimatedCounter";
import GlassCard from "../ui/GlassCard";

export default function HealthGauge({ score = 0, status = "Loading" }) {
  const animatedScore = useAnimatedCounter(score, 1500, true);
  const displayScore = Math.round(animatedScore);

  // Color based on score thresholds
  let color = "#10b981"; // green
  let colorLight = "rgba(16, 185, 129, 0.15)";
  if (score < 80) { color = "#f59e0b"; colorLight = "rgba(245, 158, 11, 0.15)"; }
  if (score < 60) { color = "#f97316"; colorLight = "rgba(249, 115, 22, 0.15)"; }
  if (score < 40) { color = "#ef4444"; colorLight = "rgba(239, 68, 68, 0.15)"; }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <GlassCard delay={0.2} className="flex flex-col items-center">
      <h3
        className="text-sm font-semibold uppercase tracking-wider mb-6 self-start"
        style={{ color: "var(--text-muted)" }}
      >
        Water Health Score
      </h3>

      <div className="relative" style={{ width: "200px", height: "200px" }}>
        {/* Outer Glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colorLight} 0%, transparent 70%)`,
            filter: "blur(20px)",
            transform: "scale(1.3)",
          }}
        />

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--border-primary)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Progress */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color }}
          >
            {displayScore}
          </motion.span>
          <span
            className="text-xs font-medium mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            / 100
          </span>
        </div>
      </div>

      {/* Status Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 flex items-center gap-2"
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
        <span
          className="text-lg font-semibold"
          style={{ color }}
        >
          {status}
        </span>
      </motion.div>
    </GlassCard>
  );
}
