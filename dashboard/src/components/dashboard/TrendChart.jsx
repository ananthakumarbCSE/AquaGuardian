import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import GlassCard from "../ui/GlassCard";

const lineConfig = [
  { key: "ph", label: "pH", color: "#3b82f6", gradient: "phGradient" },
  { key: "temperature", label: "Temperature", color: "#ef4444", gradient: "tempGradient" },
  { key: "tds", label: "TDS", color: "#06b6d4", gradient: "tdsGradient" },
  { key: "turbidity", label: "Turbidity", color: "#f59e0b", gradient: "turbGradient" },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-3"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow)",
        minWidth: "160px",
      }}
    >
      <p
        className="text-xs font-medium mb-2 pb-2"
        style={{
          color: "var(--text-muted)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          className="flex items-center justify-between gap-4 py-0.5"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span
              className="text-xs capitalize"
              style={{ color: "var(--text-secondary)" }}
            >
              {entry.dataKey}
            </span>
          </div>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export default function TrendChart({ data = [] }) {
  const [visibleLines, setVisibleLines] = useState(
    lineConfig.reduce((acc, line) => ({ ...acc, [line.key]: true }), {})
  );

  const toggleLine = (key) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <GlassCard delay={0.4} padding="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Sensor Trends
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Last {data.length} readings
          </p>
        </div>

        {/* Custom Legend / Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {lineConfig.map((line) => (
            <motion.button
              key={line.key}
              onClick={() => toggleLine(line.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer border-none outline-none text-xs font-medium"
              style={{
                background: visibleLines[line.key]
                  ? `${line.color}15`
                  : "var(--bg-surface)",
                color: visibleLines[line.key]
                  ? line.color
                  : "var(--text-muted)",
                border: `1px solid ${
                  visibleLines[line.key]
                    ? `${line.color}30`
                    : "var(--border-primary)"
                }`,
                opacity: visibleLines[line.key] ? 1 : 0.5,
                transition: "all var(--transition-fast)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: visibleLines[line.key]
                    ? line.color
                    : "var(--text-muted)",
                }}
              />
              {line.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
          >
            <defs>
              {lineConfig.map((line) => (
                <linearGradient
                  key={line.gradient}
                  id={line.gradient}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={line.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "var(--chart-text)" }}
              axisLine={{ stroke: "var(--border-primary)" }}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "var(--chart-text)" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <AnimatePresence>
              {lineConfig.map(
                (line) =>
                  visibleLines[line.key] && (
                    <Area
                      key={line.key}
                      type="monotone"
                      dataKey={line.key}
                      stroke={line.color}
                      strokeWidth={2.5}
                      fill={`url(#${line.gradient})`}
                      dot={false}
                      activeDot={{
                        r: 5,
                        stroke: line.color,
                        strokeWidth: 2,
                        fill: "var(--bg-primary)",
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  )
              )}
            </AnimatePresence>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
