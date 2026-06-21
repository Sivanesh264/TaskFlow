// src/components/tasks/TaskFilters.jsx
// Search, filter, sort, and view toggle controls
import { MdSearch, MdViewModule, MdViewList, MdSort } from "react-icons/md";

export default function TaskFilters({ filters, onChange, viewMode, onViewModeChange }) {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* ─── Search ──────────────────────────────── */}
      <div className="relative flex-1">
        <MdSearch
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="input pl-9"
        />
      </div>

      {/* ─── Status Filter ───────────────────────── */}
      <select
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="input w-full sm:w-36"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* ─── Priority Filter ─────────────────────── */}
      <select
        value={filters.priority}
        onChange={(e) => handleChange("priority", e.target.value)}
        className="input w-full sm:w-36"
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* ─── Sort ────────────────────────────────── */}
      <select
        value={`${filters.sortBy}_${filters.order}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split("_");
          onChange({ ...filters, sortBy, order });
        }}
        className="input w-full sm:w-44"
      >
        <option value="createdAt_desc">Newest First</option>
        <option value="createdAt_asc">Oldest First</option>
        <option value="dueDate_asc">Due Date ↑</option>
        <option value="dueDate_desc">Due Date ↓</option>
        <option value="priority_desc">Priority (High first)</option>
      </select>

      {/* ─── View Mode Toggle ────────────────────── */}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden flex-shrink-0">
        <button
          onClick={() => onViewModeChange("card")}
          title="Card view"
          className={`px-3 py-2 transition-colors ${
            viewMode === "card"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <MdViewModule size={18} />
        </button>
        <button
          onClick={() => onViewModeChange("table")}
          title="Table view"
          className={`px-3 py-2 border-l border-gray-300 dark:border-gray-700 transition-colors ${
            viewMode === "table"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <MdViewList size={18} />
        </button>
      </div>
    </div>
  );
}
