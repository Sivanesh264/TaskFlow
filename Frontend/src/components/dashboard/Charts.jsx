// src/components/dashboard/Charts.jsx
// Uses Chart.js via react-chartjs-2
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components (required)
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Charts({ stats }) {
  if (!stats) return null;

  // ─── Pie Chart: Task Status ──────────────────
  const pieData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [stats.pending || 0, stats.inProgress || 0, stats.completed || 0],
        backgroundColor: ["#fbbf24", "#8b5cf6", "#22c55e"],
        borderColor: ["#f59e0b", "#7c3aed", "#16a34a"],
        borderWidth: 2,
      },
    ],
  };

  // ─── Bar Chart: Priority Distribution ────────
  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [stats.lowPriority || 0, stats.mediumPriority || 0, stats.highPriority || 0],
        backgroundColor: ["#6ee7b7", "#fcd34d", "#fca5a5"],
        borderColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "rgba(156, 163, 175, 0.2)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const hasData = (stats.pending + stats.inProgress + stats.completed) > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ─── Pie Chart ──────────────────────────── */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Task Status Distribution
        </h3>
        <div className="h-56 flex items-center justify-center">
          {hasData ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <p className="text-gray-400 dark:text-gray-600 text-sm">No tasks yet</p>
          )}
        </div>
      </div>

      {/* ─── Bar Chart ──────────────────────────── */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Priority Distribution
        </h3>
        <div className="h-56">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
