import { motion } from "framer-motion";
import {
  FiHeart,
  FiDroplet,
  FiCpu,
  FiAlertTriangle,
  FiDatabase,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";

import useDashboardData from "../hooks/useDashboardData";

// UI Components
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import SectionTitle from "../components/ui/SectionTitle";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

// Dashboard Components
import HealthGauge from "../components/dashboard/HealthGauge";
import SensorCard from "../components/dashboard/SensorCard";
import TrendChart from "../components/dashboard/TrendChart";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import PredictionCard from "../components/dashboard/PredictionCard";
import MaintenanceCard from "../components/dashboard/MaintenanceCard";
import DeviceStatus from "../components/dashboard/DeviceStatus";
import SystemStatus from "../components/dashboard/SystemStatus";
import QuickActions from "../components/dashboard/QuickActions";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Dashboard() {
  const {
    summary,
    latest,
    chartData,
    alerts,
    prediction,
    maintenance,
    loading,
    lastRefresh,
    refresh,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton variant="card" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton variant="gauge" />
          <div className="lg:col-span-2">
            <LoadingSkeleton variant="card" count={4} />
          </div>
        </div>
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="p-4 sm:p-6 space-y-8 max-w-[1600px] mx-auto"
    >
      {/* === Hero Section === */}
      <motion.div variants={fadeUp}>
        <PageHeader summary={summary} latest={latest} />
      </motion.div>

      {/* === Summary Stats === */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          <StatCard
            title="Health Score"
            value={summary?.latest_health_score}
            icon={FiHeart}
            color="var(--color-danger)"
            delay={0.1}
          />
          <StatCard
            title="Water Status"
            value={summary?.water_status ?? "--"}
            icon={FiDroplet}
            color="var(--accent-cyan)"
            delay={0.15}
          />
          <StatCard
            title="Active Devices"
            value={summary ? `${summary.active_devices}/${summary.total_devices}` : "--"}
            icon={FiCpu}
            color="var(--color-info)"
            delay={0.2}
          />
          <StatCard
            title="Total Alerts"
            value={summary?.total_alerts}
            icon={FiAlertTriangle}
            color="var(--color-warning)"
            suffix={summary ? `(${summary.high_alerts} high)` : ""}
            delay={0.25}
          />
          <StatCard
            title="Total Readings"
            value={summary?.total_readings}
            icon={FiDatabase}
            color="var(--color-success)"
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* === Health Gauge + Sensors === */}
      <motion.div variants={fadeUp}>
        <SectionTitle
          icon={FiActivity}
          title="Live Sensors"
          description="Real-time water quality sensor readings"
          delay={0.3}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <HealthGauge
            score={latest?.health_score ?? 0}
            status={latest?.water_status ?? "Loading"}
          />
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SensorCard type="ph" value={latest?.ph} delay={0.3} />
            <SensorCard type="temperature" value={latest?.temperature} delay={0.35} />
            <SensorCard type="turbidity" value={latest?.turbidity} delay={0.4} />
            <SensorCard type="tds" value={latest?.tds} delay={0.45} />
          </div>
        </div>
      </motion.div>

      {/* === Trend Charts === */}
      <motion.div variants={fadeUp}>
        <SectionTitle
          icon={FiTrendingUp}
          title="Trends"
          description="Historical sensor data visualization"
          delay={0.4}
        />
        <TrendChart data={chartData} />
      </motion.div>

      {/* === Prediction + Maintenance === */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PredictionCard prediction={prediction} />
          <MaintenanceCard maintenance={maintenance} />
        </div>
      </motion.div>

      {/* === Alerts + Device Status + System === */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AlertsPanel alerts={alerts} />
          <div className="space-y-6">
            <DeviceStatus summary={summary} />
            <QuickActions onRefresh={refresh} />
          </div>
          <SystemStatus lastRefresh={lastRefresh} summary={summary} />
        </div>
      </motion.div>

      {/* Bottom Spacer */}
      <div className="h-6" />
    </motion.div>
  );
}