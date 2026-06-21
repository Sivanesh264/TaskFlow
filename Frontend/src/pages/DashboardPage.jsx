// src/pages/DashboardPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { taskAPI } from "../services/api";
import StatsCards from "../components/dashboard/StatsCards";
import Charts from "../components/dashboard/Charts";
import RecentTasks from "../components/dashboard/RecentTasks";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch stats and recent tasks in parallel
        const [statsRes, tasksRes] = await Promise.all([
          taskAPI.getStats(),
          taskAPI.getAll({ sortBy: "createdAt", order: "desc", limit: 5 }),
        ]);
        setStats(statsRes.data.stats);
        setRecentTasks(tasksRes.data.tasks);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate completion percentage
  const completionPct = stats?.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Good {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Here's what's happening with your tasks today.
          </p>
        </div>
        {/* Completion badge */}
        {!loading && stats?.total > 0 && (
          <div className="hidden sm:flex items-center gap-3 card px-5 py-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3"
                  className="text-gray-200 dark:text-gray-700" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3"
                  strokeDasharray={`${completionPct} ${100 - completionPct}`}
                  className="text-green-500 transition-all duration-700" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
                {completionPct}%
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.completed} / {stats.total}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── Stats Cards ─────────────────────────── */}
      <StatsCards stats={stats} loading={loading} />

      {/* ─── Charts ──────────────────────────────── */}
      {!loading && stats?.total > 0 && <Charts stats={stats} />}

      {/* ─── Recent Tasks ────────────────────────── */}
      <RecentTasks tasks={recentTasks} loading={loading} />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
