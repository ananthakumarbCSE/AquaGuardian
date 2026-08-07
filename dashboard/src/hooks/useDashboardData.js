import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

const REFRESH_INTERVAL = 30000; // 30 seconds

export default function useDashboardData() {
  const [summary, setSummary] = useState(null);
  const [latest, setLatest] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const intervalRef = useRef(null);

  const fetchAll = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);

    try {
      const [
        summaryRes,
        latestRes,
        chartRes,
        recentAlertsRes,
        alertsRes,
        predictionRes,
        maintenanceRes,
      ] = await Promise.allSettled([
        api.get("/dashboard/summary"),
        api.get("/dashboard/latest-reading"),
        api.get("/dashboard/chart-data?limit=10"),
        api.get("/dashboard/recent-alerts?limit=5"),
        api.get("/alerts/"),
        api.get("/prediction/"),
        api.get("/maintenance/"),
      ]);

      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data);
      if (latestRes.status === "fulfilled") setLatest(latestRes.value.data);

      if (chartRes.status === "fulfilled") {
        const d = chartRes.value.data;
        const formatted = d.timestamps.map((time, index) => ({
          time: new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          ph: d.ph[index],
          temperature: d.temperature[index],
          tds: d.tds[index],
          turbidity: d.turbidity[index],
        }));
        setChartData(formatted);
      }

      if (recentAlertsRes.status === "fulfilled") setRecentAlerts(recentAlertsRes.value.data);
      if (alertsRes.status === "fulfilled") setAlerts(alertsRes.value.data);
      if (predictionRes.status === "fulfilled") setPrediction(predictionRes.value.data);
      if (maintenanceRes.status === "fulfilled") setMaintenance(maintenanceRes.value.data);

      setLastRefresh(new Date());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchAll(false);
  }, [fetchAll]);

  useEffect(() => {
    fetchAll(true);

    intervalRef.current = setInterval(() => {
      fetchAll(false);
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  return {
    summary,
    latest,
    chartData,
    recentAlerts,
    alerts,
    prediction,
    maintenance,
    loading,
    error,
    lastRefresh,
    refresh,
  };
}
