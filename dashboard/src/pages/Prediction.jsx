import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiZap,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiAlertTriangle,
  FiCheckCircle,
  FiCpu,
  FiTarget,
  FiActivity,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import PageTransition from "../components/ui/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import StatusBadge from "../components/ui/StatusBadge";
import AnimatedProgress from "../components/ui/AnimatedProgress";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import ErrorState from "../components/ui/ErrorState";
import useAnimatedCounter from "../hooks/useAnimatedCounter";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(20px)",
      }}
    >
      <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {entry.name}: <strong style={{ color: "var(--text-primary)" }}>{entry.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Prediction() {
  const [prediction, setPrediction] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [predRes, chartRes] = await Promise.allSettled([
        api.get("/prediction/"),
        api.get("/dashboard/chart-data?limit=20"),
      ]);

      if (predRes.status === "fulfilled") setPrediction(predRes.value.data);
      if (chartRes.status === "fulfilled") {
        const d = chartRes.value.data;
        const formatted = d.timestamps.map((time, index) => ({
          time: new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          ph: d.ph[index],
          temperature: d.temperature[index],
          tds: d.tds[index],
          turbidity: d.turbidity[index],
        }));
        setChartData(formatted);
      }
    } catch (err) {
      setError(err.message || "Failed to load prediction");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute health score history for the prediction chart
  const healthChartData = useMemo(() => {
    if (!chartData.length || !prediction) return [];
    // Simple health score estimation from sensor values for chart visualization
    const data = chartData.map((d, i) => ({
      reading: `R${i + 1}`,
      score: Math.round(
        Math.max(0, Math.min(100,
          100 - Math.abs(d.ph - 7) * 8 - (d.turbidity > 5 ? 15 : 0) - (d.tds > 500 ? 10 : 0)
        ))
      ),
    }));
    // Add predicted point
    data.push({
      reading: "Predicted",
      score: prediction.predicted_health_score,
      isPredicted: true,
    });
    return data;
  }, [chartData, prediction]);

  const currentScore = useAnimatedCounter(prediction?.current_health_score, 1200, !!prediction);
  const predictedScore = useAnimatedCounter(prediction?.predicted_health_score, 1200, !!prediction);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="gauge" />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="p-6">
          <ErrorState message={error} onRetry={fetchData} />
        </div>
      </PageTransition>
    );
  }

  const trendIcon =
    prediction?.trend === "Improving"
      ? FiTrendingUp
      : prediction?.trend === "Declining"
      ? FiTrendingDown
      : FiMinus;

  const trendColor =
    prediction?.trend === "Improving"
      ? "var(--color-success)"
      : prediction?.trend === "Declining"
      ? "var(--color-danger)"
      : "var(--color-warning)";

  const delta = (prediction?.predicted_health_score || 0) - (prediction?.current_health_score || 0);
  const confidence = Math.max(0, Math.min(100, 100 - Math.abs(delta) * 3));

  const riskLevel =
    (prediction?.predicted_health_score || 0) >= 80
      ? { label: "Low Risk", color: "var(--color-success)", bg: "rgba(16,185,129,0.1)" }
      : (prediction?.predicted_health_score || 0) >= 60
      ? { label: "Moderate Risk", color: "var(--color-warning)", bg: "rgba(245,158,11,0.1)" }
      : { label: "High Risk", color: "var(--color-danger)", bg: "rgba(239,68,68,0.1)" };

  const TrendIcon = trendIcon;

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
            icon={FiZap}
            title="AI Prediction Engine"
            description="Machine learning powered water quality forecasting using linear regression"
          />
        </motion.div>

        {/* Score Gauges */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Score */}
            <ScoreGauge
              label="Current Health Score"
              score={Math.round(currentScore)}
              color="var(--accent-cyan)"
              delay={0.1}
            />

            {/* Trend & Delta */}
            <GlassCard delay={0.2}>
              <div className="flex flex-col items-center justify-center h-full py-4">
                <motion.div
                  animate={
                    prediction?.trend === "Improving"
                      ? { y: [0, -6, 0] }
                      : prediction?.trend === "Declining"
                      ? { y: [0, 6, 0] }
                      : { x: [0, 4, -4, 0] }
                  }
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center rounded-2xl mb-4"
                  style={{
                    width: "64px",
                    height: "64px",
                    background: `${trendColor}15`,
                    color: trendColor,
                  }}
                >
                  <TrendIcon size={28} />
                </motion.div>

                <p className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  {prediction?.trend || "Unknown"}
                </p>

                <p className="text-sm font-medium" style={{ color: trendColor }}>
                  {delta > 0 ? "+" : ""}{delta} points
                </p>

                <div className="mt-4 w-full px-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Confidence
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {confidence}%
                    </span>
                  </div>
                  <AnimatedProgress
                    value={confidence}
                    max={100}
                    color="var(--accent-cyan)"
                    height={4}
                    delay={0.5}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Predicted Score */}
            <ScoreGauge
              label="Predicted Health Score"
              score={Math.round(predictedScore)}
              color={trendColor}
              delay={0.3}
              isPrediction
            />
          </div>
        </motion.div>

        {/* Risk Indicator + Recommendation */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Indicator */}
            <GlassCard>
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: riskLevel.bg,
                    color: riskLevel.color,
                  }}
                >
                  <FiTarget size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                    Risk Assessment
                  </p>
                  <p className="text-lg font-bold mb-2" style={{ color: riskLevel.color }}>
                    {riskLevel.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Based on predicted health score of {prediction?.predicted_health_score}.
                    {prediction?.predicted_health_score >= 80
                      ? " Water quality is expected to remain safe."
                      : prediction?.predicted_health_score >= 60
                      ? " Monitor closely and consider preventive maintenance."
                      : " Immediate attention recommended."}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* AI Recommendation */}
            <GlassCard>
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--accent-glow)",
                    color: "var(--accent-cyan)",
                  }}
                >
                  <FiCpu size={22} />
                </motion.div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                    AI Recommendation
                  </p>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {prediction?.recommendation || "No recommendation available"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <FiCheckCircle size={12} style={{ color: "var(--color-success)" }} />
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Powered by Linear Regression ML Model
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Prediction Timeline Chart */}
        {healthChartData.length > 0 && (
          <motion.div variants={fadeUp}>
            <SectionTitle
              icon={FiActivity}
              title="Health Score Timeline"
              description="Historical health scores with predicted next value"
              delay={0.3}
            />
            <GlassCard>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={healthChartData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="reading" tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={60} stroke="var(--color-warning)" strokeDasharray="5 5" label={{ value: "Warning", fill: "var(--color-warning)", fontSize: 10 }} />
                    <ReferenceLine y={80} stroke="var(--color-success)" strokeDasharray="5 5" label={{ value: "Good", fill: "var(--color-success)", fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      fill="url(#scoreGradient)"
                      stroke="transparent"
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Health Score"
                      stroke="var(--accent-cyan)"
                      strokeWidth={2.5}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        if (payload.isPredicted) {
                          return (
                            <g key="predicted-dot">
                              <circle cx={cx} cy={cy} r={8} fill={trendColor} opacity={0.2} />
                              <circle cx={cx} cy={cy} r={5} fill={trendColor} stroke="#fff" strokeWidth={2} />
                            </g>
                          );
                        }
                        return <circle key={`dot-${cx}`} cx={cx} cy={cy} r={3} fill="var(--accent-cyan)" />;
                      }}
                      activeDot={{ r: 6, fill: "var(--accent-cyan)", stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={2000}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="h-6" />
      </motion.div>
    </PageTransition>
  );
}

function ScoreGauge({ label, score, color, delay = 0, isPrediction = false }) {
  const scoreColor =
    score >= 80 ? "var(--color-success)" :
    score >= 60 ? "var(--color-warning)" :
    "var(--color-danger)";

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <GlassCard delay={delay}>
      <div className="flex flex-col items-center py-4">
        <p
          className="text-xs uppercase tracking-wider mb-5 flex items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          {isPrediction && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: color }}
            />
          )}
          {label}
        </p>

        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="var(--border-primary)"
              strokeWidth="8"
              fill="none"
            />
            {/* Score ring */}
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke={scoreColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 6px ${scoreColor}50)`,
              }}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {score}
            </span>
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              / 100
            </span>
          </div>
        </div>

        <StatusBadge
          status={
            score >= 80 ? "Excellent" : score >= 60 ? "Moderate" : "Critical"
          }
          size="sm"
        />
      </div>
    </GlassCard>
  );
}
