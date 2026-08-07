import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiMapPin,
  FiClock,
  FiActivity,
  FiWifi,
  FiWifiOff,
  FiSearch,
  FiHash,
} from "react-icons/fi";

import api from "../services/api";
import GlassCard from "../components/ui/GlassCard";
import PageTransition from "../components/ui/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import SearchInput from "../components/ui/SearchInput";
import FilterChips from "../components/ui/FilterChips";
import StatusBadge from "../components/ui/StatusBadge";
import StatCard from "../components/ui/StatCard";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/devices/list");
      setDevices(res.data);
    } catch (err) {
      setError(err.message || "Failed to load devices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const stats = useMemo(() => {
    const total = devices.length;
    const active = devices.filter((d) => d.status === "ACTIVE").length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [devices]);

  const filterOptions = useMemo(
    () => [
      { label: "All", value: "all", count: stats.total },
      { label: "Active", value: "ACTIVE", count: stats.active },
      { label: "Inactive", value: "INACTIVE", count: stats.inactive },
    ],
    [stats]
  );

  const filteredDevices = useMemo(() => {
    let result = devices;
    if (filter !== "all") {
      result = result.filter((d) => d.status === filter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.device_name.toLowerCase().includes(q) ||
          d.device_id.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
      );
    }
    return result;
  }, [devices, filter, searchQuery]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="p-6">
          <ErrorState message={error} onRetry={fetchDevices} />
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
            icon={FiCpu}
            title="Device Fleet"
            description="Monitor and manage your connected IoT water quality sensors"
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              title="Total Devices"
              value={stats.total}
              icon={FiCpu}
              color="var(--accent-cyan)"
              delay={0.1}
            />
            <StatCard
              title="Online"
              value={stats.active}
              icon={FiWifi}
              color="var(--color-success)"
              delay={0.15}
            />
            <StatCard
              title="Offline"
              value={stats.inactive}
              icon={FiWifiOff}
              color="var(--color-danger)"
              delay={0.2}
            />
          </div>
        </motion.div>

        {/* Search + Filter */}
        <motion.div variants={fadeUp}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <FilterChips
              options={filterOptions}
              active={filter}
              onChange={setFilter}
            />
            <div className="w-full sm:w-72">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search devices..."
              />
            </div>
          </div>
        </motion.div>

        {/* Device Cards */}
        {filteredDevices.length === 0 ? (
          <EmptyState
            icon={FiSearch}
            title="No Devices Found"
            description={
              searchQuery || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No devices have been registered yet"
            }
          />
        ) : (
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filteredDevices.map((device, index) => (
              <DeviceCard key={device.id} device={device} index={index} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </PageTransition>
  );
}

function DeviceCard({ device, index }) {
  const isActive = device.status === "ACTIVE";
  const createdDate = new Date(device.created_at || Date.now());
  const timeSince = getTimeSince(createdDate);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: index * 0.06 },
        },
      }}
    >
      <GlassCard delay={0}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon with pulse */}
            <div className="relative">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: "44px",
                  height: "44px",
                  background: isActive
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  color: isActive
                    ? "var(--color-success)"
                    : "var(--color-danger)",
                }}
              >
                <FiCpu size={20} />
              </div>
              {/* Status pulse dot */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: "var(--glass-bg)",
                  background: isActive ? "var(--color-success)" : "var(--color-danger)",
                  animation: isActive ? "connected-pulse 2s infinite" : "none",
                }}
              />
            </div>
            <div>
              <h4
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {device.device_name}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <FiHash size={10} style={{ color: "var(--text-muted)" }} />
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {device.device_id}
                </span>
              </div>
            </div>
          </div>

          <StatusBadge status={device.status === "ACTIVE" ? "Good" : "Critical"} size="xs" />
        </div>

        {/* Details */}
        <div className="space-y-3 mt-4">
          <DetailRow icon={FiMapPin} label="Location" value={device.location} />
          <DetailRow
            icon={FiActivity}
            label="Status"
            value={isActive ? "Online" : "Offline"}
            valueColor={isActive ? "var(--color-success)" : "var(--color-danger)"}
          />
          <DetailRow icon={FiClock} label="Registered" value={timeSince} />
        </div>

        {/* Bottom bar */}
        <div
          className="mt-4 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border-primary)" }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isActive ? "var(--color-success)" : "var(--color-danger)",
              }}
            />
            <span
              className="text-[11px] font-medium"
              style={{
                color: isActive ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {isActive ? "Connected" : "Disconnected"}
            </span>
          </div>
          <span
            className="text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            v1.0.0
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function DetailRow({ icon: Icon, label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={13} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: valueColor || "var(--text-secondary)" }}
      >
        {value}
      </span>
    </div>
  );
}

function getTimeSince(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}
