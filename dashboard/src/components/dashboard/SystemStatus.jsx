import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiWifi, FiClock, FiServer } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";

export default function SystemStatus({ lastRefresh, summary }) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!lastRefresh) return;

    const update = () => {
      setSecondsAgo(Math.floor((Date.now() - lastRefresh.getTime()) / 1000));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastRefresh]);

  const formatLastUpdate = () => {
    if (secondsAgo < 5) return "Just now";
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    return `${Math.floor(secondsAgo / 60)}m ago`;
  };

  return (
    <GlassCard delay={0.65}>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: "28px",
            height: "28px",
            background: "rgba(16, 185, 129, 0.1)",
            color: "var(--color-success)",
          }}
        >
          <FiServer size={14} />
        </div>
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          System
        </h3>
      </div>

      <div className="space-y-3">
        {/* API Status */}
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center gap-2">
            <FiWifi size={13} style={{ color: "var(--color-success)" }} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              API Connection
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="status-dot status-dot--online" />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-success)" }}
            >
              Connected
            </span>
          </div>
        </div>

        {/* Last Refresh */}
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center gap-2">
            <FiClock size={13} style={{ color: "var(--text-muted)" }} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Last Updated
            </span>
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {formatLastUpdate()}
          </span>
        </div>

        {/* Total Readings */}
        {summary && (
          <div
            className="flex items-center justify-between p-3 rounded-xl"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div className="flex items-center gap-2">
              <FiServer size={13} style={{ color: "var(--text-muted)" }} />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Readings
              </span>
            </div>
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {summary.total_readings}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
