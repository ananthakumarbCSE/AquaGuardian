import { motion } from "framer-motion";
import { FiZap, FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import useAnimatedCounter from "../../hooks/useAnimatedCounter";
import GlassCard from "../ui/GlassCard";

export default function PredictionCard({ prediction }) {
  const currentScore = useAnimatedCounter(
    prediction?.current_health_score ?? 0,
    1200,
    !!prediction
  );

  const predictedScore = useAnimatedCounter(
    prediction?.predicted_health_score ?? 0,
    1200,
    !!prediction
  );

  if (!prediction) {
    return (
      <GlassCard delay={0.5}>
        <div
          className="flex flex-col items-center justify-center py-8"
          style={{ color: "var(--text-muted)" }}
        >
          <FiZap size={24} className="mb-2 opacity-30" />
          <p className="text-sm">Loading prediction...</p>
        </div>
      </GlassCard>
    );
  }

  const trendIcon =
    prediction.trend === "improving" || prediction.trend === "Improving" ? (
      <FiTrendingUp size={16} />
    ) : prediction.trend === "declining" || prediction.trend === "Declining" ? (
      <FiTrendingDown size={16} />
    ) : (
      <FiMinus size={16} />
    );

  const trendColor =
    prediction.trend === "improving" || prediction.trend === "Improving"
      ? "var(--color-success)"
      : prediction.trend === "declining" || prediction.trend === "Declining"
      ? "var(--color-danger)"
      : "var(--text-muted)";

  return (
    <GlassCard delay={0.5}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(139, 92, 246, 0.1)",
              color: "#8b5cf6",
            }}
          >
            <FiZap size={14} />
          </div>
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            AI Prediction
          </h3>
        </div>

        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{
            background: `${trendColor}15`,
            color: trendColor,
          }}
        >
          {trendIcon}
          <span className="text-xs font-medium capitalize">
            {prediction.trend}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div
          className="p-3 rounded-xl text-center"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <p
            className="text-[10px] font-medium uppercase tracking-wider mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Current
          </p>
          <motion.p
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {Math.round(currentScore)}
          </motion.p>
        </div>

        <div
          className="p-3 rounded-xl text-center relative overflow-hidden"
          style={{
            background: "rgba(139, 92, 246, 0.05)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
          }}
        >
          <p
            className="text-[10px] font-medium uppercase tracking-wider mb-1"
            style={{ color: "#8b5cf6" }}
          >
            Predicted
          </p>
          <motion.p
            className="text-2xl font-bold"
            style={{ color: "#8b5cf6" }}
          >
            {Math.round(predictedScore)}
          </motion.p>

          {/* Subtle glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
            }}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div
        className="p-3 rounded-xl"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <p
          className="text-[10px] font-medium uppercase tracking-wider mb-1"
          style={{ color: "var(--text-muted)" }}
        >
          Recommendation
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {prediction.recommendation}
        </p>
      </div>
    </GlassCard>
  );
}
