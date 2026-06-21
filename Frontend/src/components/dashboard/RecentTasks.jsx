// src/components/dashboard/RecentTasks.jsx
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import Badge from "../ui/Badge";

function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentTasks({ tasks = [], loading }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Recent Tasks
        </h3>
        <Link
          to="/tasks"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all <MdArrowForward size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-10 text-center text-gray-400 dark:text-gray-600 text-sm">
          No tasks yet. <Link to="/tasks" className="text-blue-600 hover:underline">Create your first task →</Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
                  {task.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Due: {formatDate(task.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <Badge value={task.priority} />
                <Badge value={task.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
