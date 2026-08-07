export default function StatusBadge({ status, size = "sm" }) {
  const config = {
    HIGH: {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#ef4444",
      border: "rgba(239, 68, 68, 0.25)",
    },
    MEDIUM: {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#f59e0b",
      border: "rgba(245, 158, 11, 0.25)",
    },
    LOW: {
      bg: "rgba(16, 185, 129, 0.12)",
      color: "#10b981",
      border: "rgba(16, 185, 129, 0.25)",
    },
    Excellent: {
      bg: "rgba(16, 185, 129, 0.12)",
      color: "#10b981",
      border: "rgba(16, 185, 129, 0.25)",
    },
    Good: {
      bg: "rgba(16, 185, 129, 0.12)",
      color: "#10b981",
      border: "rgba(16, 185, 129, 0.25)",
    },
    Moderate: {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#f59e0b",
      border: "rgba(245, 158, 11, 0.25)",
    },
    Poor: {
      bg: "rgba(249, 115, 22, 0.12)",
      color: "#f97316",
      border: "rgba(249, 115, 22, 0.25)",
    },
    Critical: {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#ef4444",
      border: "rgba(239, 68, 68, 0.25)",
    },
    Unsafe: {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#ef4444",
      border: "rgba(239, 68, 68, 0.25)",
    },
  };

  const defaultConfig = {
    bg: "rgba(148, 163, 184, 0.12)",
    color: "#94a3b8",
    border: "rgba(148, 163, 184, 0.25)",
  };

  // Match by key or partial match
  const matchKey = Object.keys(config).find(
    (key) =>
      key.toLowerCase() === (status || "").toLowerCase() ||
      (status || "").toLowerCase().includes(key.toLowerCase())
  );
  const style = matchKey ? config[matchKey] : defaultConfig;

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClasses[size] || sizeClasses.sm}`}
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        boxShadow: `0 0 8px ${style.bg}`,
      }}
    >
      {status}
    </span>
  );
}
