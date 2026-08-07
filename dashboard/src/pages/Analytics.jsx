import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiDroplet,
  FiThermometer,
  FiActivity,
  FiZap,
  FiHeart,
  FiDatabase,
  FiAlertTriangle,
  FiBarChart2,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import PageTransition from "../components/ui/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import StatCard from "../components/ui/StatCard";
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
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {entry.name}: <strong style={{ color: "var(--text-primary)" }}>{typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, chartRes] = await Promise.allSettled([
        api.get("/analytics/"),
        api.get("/dashboard/chart-data?limit=50"),
      ]);

      if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
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
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute min/max from chart data
  const ranges = useMemo(() => {
    if (!chartData.length) return null;
    const calc = (key) => {
      const values = chartData.map((d) => d[key]).filter((v) => v != null);
      return { min: Math.min(...values), max: Math.max(...values) };
    };
    return {
      ph: calc("ph"),
      temperature: calc("temperature"),
      tds: calc("tds"),
      turbidity: calc("turbidity"),
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="chart" />
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
            icon={FiBarChart2}
            title="Analytics Dashboard"
            description="Comprehensive water quality data analysis and insights"
          />
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <StatCard
              title="Avg pH"
              value={analytics?.average_ph}
              icon={FiDroplet}
              color="#3b82f6"
              delay={0.05}
            />
            <StatCard
              title="Avg Temp"
              value={analytics?.average_temperature}
              icon={FiThermometer}
              suffix="°C"
              color="#ef4444"
              delay={0.1}
            />
            <StatCard
              title="Avg TDS"
              value={analytics?.average_tds}
              icon={FiZap}
              suffix="ppm"
              color="#06b6d4"
              delay={0.15}
            />
            <StatCard
              title="Avg Turbidity"
              value={analytics?.average_turbidity}
              icon={FiActivity}
              suffix="NTU"
              color="#f59e0b"
              delay={0.2}
            />
            <StatCard
              title="Health Score"
              value={analytics?.average_health_score}
              icon={FiHeart}
              color="var(--color-success)"
              delay={0.25}
            />
            <StatCard
              title="Readings"
              value={analytics?.total_readings}
              icon={FiDatabase}
              color="var(--accent-cyan)"
              delay={0.3}
            />
            <StatCard
              title="Alerts"
              value={analytics?.total_alerts}
              icon={FiAlertTriangle}
              color="var(--color-warning)"
              delay={0.35}
            />
          </div>
        </motion.div>

        {/* Trend Status */}
        {analytics?.trend && (
          <motion.div variants={fadeUp}>
            <GlassCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "var(--accent-glow)",
                      color: "var(--accent-cyan)",
                    }}
                  >
                    <FiTrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      Overall Water Quality Trend
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Based on {analytics.total_readings} total sensor readings
                    </p>
                  </div>
                </div>
                <StatusBadge status={analytics.trend} size="md" />
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Charts Row 1: pH + Temperature */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <ChartHeader
                icon={FiDroplet}
                title="pH Level Trend"
                color="#3b82f6"
                range={ranges?.ph}
              />
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <YAxis domain={[0, 14]} tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="ph"
                      name="pH"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard>
              <ChartHeader
                icon={FiThermometer}
                title="Temperature Trend"
                color="#ef4444"
                range={ranges?.temperature}
                unit="°C"
              />
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Charts Row 2: Turbidity (Area) + TDS (Bar) */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <ChartHeader
                icon={FiActivity}
                title="Turbidity Trend"
                color="#f59e0b"
                range={ranges?.turbidity}
                unit="NTU"
              />
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="turbidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="turbidity"
                      name="Turbidity"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#turbidityGradient)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard>
              <ChartHeader
                icon={FiZap}
                title="TDS Distribution"
                color="#06b6d4"
                range={ranges?.tds}
                unit="ppm"
              />
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="tdsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="var(--chart-text)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="tds"
                      name="TDS"
                      fill="url(#tdsGradient)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Min/Max Ranges */}
        {ranges && (
          <motion.div variants={fadeUp}>
            <SectionTitle
              icon={FiTrendingUp}
              title="Sensor Ranges"
              description="Minimum and maximum recorded values"
              delay={0.3}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <RangeCard
                label="pH Level"
                icon={FiDroplet}
                color="#3b82f6"
                min={ranges.ph.min}
                max={ranges.ph.max}
                safeMin={6.5}
                safeMax={8.5}
                unit=""
                delay={0.1}
              />
              <RangeCard
                label="Temperature"
                icon={FiThermometer}
                color="#ef4444"
                min={ranges.temperature.min}
                max={ranges.temperature.max}
                safeMin={15}
                safeMax={35}
                unit="°C"
                delay={0.15}
              />
              <RangeCard
                label="Turbidity"
                icon={FiActivity}
                color="#f59e0b"
                min={ranges.turbidity.min}
                max={ranges.turbidity.max}
                safeMin={0}
                safeMax={5}
                unit="NTU"
                delay={0.2}
              />
              <RangeCard
                label="TDS"
                icon={FiZap}
                color="#06b6d4"
                min={ranges.tds.min}
                max={ranges.tds.max}
                safeMin={0}
                safeMax={500}
                unit="ppm"
                delay={0.25}
              />
            </div>
          </motion.div>
        )}

        <div className="h-6" />
      </motion.div>
    </PageTransition>
  );
}

function ChartHeader({ icon: Icon, title, color, range, unit = "" }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "28px",
            height: "28px",
            background: `${color}15`,
            color: color,
          }}
        >
          <Icon size={14} />
        </div>
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </span>
      </div>
      {range && (
        <div className="flex items-center gap-3">
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Min: <strong style={{ color: "var(--text-secondary)" }}>{range.min.toFixed(1)}{unit}</strong>
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Max: <strong style={{ color: "var(--text-secondary)" }}>{range.max.toFixed(1)}{unit}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

function RangeCard({ label, icon: Icon, color, min, max, safeMin, safeMax, unit, delay }) {
  const avgValue = (min + max) / 2;
  const isSafe = avgValue >= safeMin && avgValue <= safeMax;

  return (
    <GlassCard delay={delay}>
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "28px",
            height: "28px",
            background: `${color}15`,
            color: color,
          }}
        >
          <Icon size={14} />
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {label}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Min
          </span>
          <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {min.toFixed(1)}<span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}> {unit}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Max
          </span>
          <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {max.toFixed(1)}<span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}> {unit}</span>
          </p>
        </div>
      </div>

      <AnimatedProgress
        value={avgValue}
        max={safeMax * 1.5 || 100}
        color={color}
        height={4}
        delay={delay + 0.3}
      />

      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: isSafe ? "var(--color-success)" : "var(--color-warning)",
          }}
        />
        <span className="text-[10px] font-medium" style={{
          color: isSafe ? "var(--color-success)" : "var(--color-warning)",
        }}>
          {isSafe ? "Within safe range" : "Outside safe range"}
        </span>
      </div>
    </GlassCard>
  );
}
